/**
 * Wires the recruiter quiz to the page. All ordering, matching and pitch
 * decisions come from src/lib/quiz.ts; this file only moves DOM around.
 */
import {
  answersToQuery,
  buildPitch,
  matchedSections,
  orderSections,
  parseAnswers,
  type Answers,
} from '../lib/quiz';
import { DEFAULT_SECTION_ORDER } from '../content/quizConfig';
import { COPY } from '../content/copy';
import type { SectionId } from '../content/types';

type StepName = 'intro' | 'focus' | 'proof' | 'result';

const QUIZ_ACTIVE_CLASS = 'quiz-active';
/** Set by the inline failsafe when it already revealed the full page; a late controller must not take over. */
const QUIZ_TIMED_OUT_CLASS = 'quiz-timed-out';
/** Tells the inline failsafe in Quiz.astro that the controller is running. */
const QUIZ_READY_CLASS = 'quiz-ready';
const SKIP_PARAM = 'skip';
const SKIP_VALUE = '1';
/** Which question number each question step is; other steps hide the progress bar. */
const QUESTION_NUMBER: Partial<Record<StepName, number>> = { focus: 1, proof: 2 };
const QUESTION_COUNT = Object.keys(QUESTION_NUMBER).length;
/** Where Back goes from each step. */
const PREVIOUS_STEP: Partial<Record<StepName, StepName>> = {
  focus: 'intro',
  proof: 'focus',
  result: 'proof',
};

type QuizElements = {
  quiz: HTMLElement;
  main: HTMLElement | null;
  progress: HTMLElement | null;
  progressFill: HTMLElement | null;
  pitch: HTMLElement | null;
};

let chosenFocus: string | null = null;

function findElements(): QuizElements | null {
  const quiz = document.querySelector<HTMLElement>('[data-quiz]');
  if (!quiz) return null;
  return {
    quiz,
    main: document.querySelector<HTMLElement>('main[data-sections]'),
    progress: quiz.querySelector<HTMLElement>('[data-progress]'),
    progressFill: quiz.querySelector<HTMLElement>('[data-progress-fill]'),
    pitch: quiz.querySelector<HTMLElement>('[data-pitch]'),
  };
}

/** While the quiz hides <main>, the quiz stands in as the page's main landmark so the page always has one. */
function setQuizActive(active: boolean): void {
  document.documentElement.classList.toggle(QUIZ_ACTIVE_CLASS, active);
  const quiz = document.querySelector<HTMLElement>('[data-quiz]');
  if (!quiz) return;
  if (active) quiz.setAttribute('role', 'main');
  else quiz.removeAttribute('role');
}

function updateProgress(elements: QuizElements, step: StepName): void {
  const { progress, progressFill } = elements;
  if (!progress) return;
  const questionNumber = QUESTION_NUMBER[step];
  progress.hidden = questionNumber === undefined;
  if (questionNumber === undefined) return;

  progress.setAttribute('aria-valuenow', String(questionNumber));
  progress.setAttribute('aria-label', COPY.quiz.progressLabel(questionNumber, QUESTION_COUNT));
  if (progressFill) progressFill.style.width = `${(questionNumber / QUESTION_COUNT) * 100}%`;
}

function showStep(elements: QuizElements, step: StepName, moveFocus = true): void {
  elements.quiz.hidden = false;
  document.documentElement.classList.add(QUIZ_READY_CLASS);
  let activeStep: HTMLElement | null = null;
  for (const stepElement of elements.quiz.querySelectorAll<HTMLElement>('[data-step]')) {
    const isActive = stepElement.dataset.step === step;
    stepElement.hidden = !isActive;
    if (isActive) activeStep = stepElement;
  }
  updateProgress(elements, step);
  if (!moveFocus) return;
  // Start each step at the top of the quiz (progress bar and mascot in view), then focus its heading.
  elements.quiz.scrollIntoView({ block: 'start' });
  activeStep?.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
}

/** Appends each section in the given order, which moves it to the end of <main>. */
function reorderSections(main: HTMLElement | null, order: SectionId[]): void {
  if (!main) return;
  for (const id of order) {
    const section = main.querySelector<HTMLElement>(`:scope > section[data-section="${id}"]`);
    if (section) main.append(section);
  }
}

function setMatchTags(main: HTMLElement | null, matched: SectionId[]): void {
  if (!main) return;
  for (const tag of main.querySelectorAll<HTMLElement>('[data-match-tag]')) {
    const sectionId = tag.closest<HTMLElement>('[data-section]')?.dataset.section as SectionId;
    tag.textContent = matched.includes(sectionId) ? COPY.quiz.matchTag : '';
  }
}

function setQuery(query: string): void {
  history.replaceState(history.state, '', `${location.pathname}${query}${location.hash}`);
}

function applyResult(elements: QuizElements, answers: Answers, moveFocus = true): void {
  reorderSections(elements.main, orderSections(answers));
  setMatchTags(elements.main, matchedSections(answers));
  if (elements.pitch) elements.pitch.textContent = buildPitch(answers);
  setQuery(answersToQuery(answers));
  setQuizActive(false);
  showStep(elements, 'result', moveFocus);
}

function restoreDefaultOrder(elements: QuizElements): void {
  reorderSections(elements.main, DEFAULT_SECTION_ORDER);
  setMatchTags(elements.main, []);
  setQuery('');
}

/** Leaves the quiz in question mode: the default page stays hidden behind it. */
function returnToQuiz(elements: QuizElements, step: StepName): void {
  restoreDefaultOrder(elements);
  setQuizActive(true);
  showStep(elements, step);
}

function skipQuiz(elements: QuizElements): void {
  setQuizActive(false);
  elements.quiz.hidden = true;
  const heroHeading = document.querySelector<HTMLElement>('#hero h1');
  if (!heroHeading) return;
  heroHeading.tabIndex = -1;
  heroHeading.focus();
}

function handleAnswer(elements: QuizElements, step: StepName, value: string): void {
  if (step === 'focus') {
    chosenFocus = value;
    showStep(elements, 'proof');
    return;
  }
  if (step !== 'proof' || !chosenFocus) return;
  // Validation goes through the same parser as shared URLs, so bad values never reach the page.
  const answers = parseAnswers(new URLSearchParams({ for: chosenFocus, proof: value }).toString());
  if (answers) applyResult(elements, answers);
}

function handleClick(elements: QuizElements, event: MouseEvent): void {
  const button = (event.target as Element | null)?.closest<HTMLElement>('button, a');
  if (!button) return;
  const step = button.closest<HTMLElement>('[data-step]')?.dataset.step as StepName | undefined;
  if (!step) return;

  if (button.dataset.answer !== undefined) handleAnswer(elements, step, button.dataset.answer);
  else if (button.hasAttribute('data-start')) showStep(elements, 'focus');
  else if (button.hasAttribute('data-skip')) skipQuiz(elements);
  else if (button.hasAttribute('data-start-over')) returnToQuiz(elements, 'intro');
  else if (button.hasAttribute('data-back')) {
    const previous = PREVIOUS_STEP[step];
    if (previous) returnToQuiz(elements, previous);
  }
}

function initQuiz(): void {
  const elements = findElements();
  if (!elements) {
    setQuizActive(false);
    return;
  }
  elements.quiz.addEventListener('click', (event) => handleClick(elements, event));

  const params = new URLSearchParams(location.search);
  const failsafeAlreadyFired = document.documentElement.classList.contains(QUIZ_TIMED_OUT_CLASS);
  if (failsafeAlreadyFired || params.get(SKIP_PARAM) === SKIP_VALUE) {
    setQuizActive(false);
    return;
  }

  const sharedAnswers = parseAnswers(location.search);
  if (sharedAnswers) {
    chosenFocus = sharedAnswers.focus;
    applyResult(elements, sharedAnswers, false);
    return;
  }

  setQuizActive(true);
  showStep(elements, 'intro', false);
}

// A broken quiz must never leave the page blank: fall back to the full page.
try {
  initQuiz();
} catch (error) {
  setQuizActive(false);
  throw error;
}
