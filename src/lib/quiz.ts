import { COPY } from '../content/copy';
import {
  DEFAULT_SECTION_ORDER,
  FIRST_SECTION,
  FOCUS_LEAD,
  LAST_SECTION,
  PROOF_PRIORITY,
} from '../content/quizConfig';
import type { SectionId } from '../content/types';

export type HiringFocus = 'cloud' | 'systems' | 'platform' | 'backend';
export type ProofPreference = 'production' | 'certs' | 'incidents' | 'code' | 'clients';
export type Answers = { focus: HiringFocus; proof: ProofPreference };

const HIRING_FOCUSES: readonly HiringFocus[] = ['cloud', 'systems', 'platform', 'backend'];
const PROOF_PREFERENCES: readonly ProofPreference[] = ['production', 'certs', 'incidents', 'code', 'clients'];

const FEATURED_SECTIONS: readonly SectionId[] = ['olympus-vision', 'careomni'];

/** Sections to highlight for the chosen proof preference. */
export function matchedSections(answers: Answers): SectionId[] {
  return PROOF_PRIORITY[answers.proof];
}

/** Puts the lead featured project ahead of the other one when both are present. */
function putLeadProjectFirst(sections: SectionId[], lead: SectionId): SectionId[] {
  const featured = sections.filter((id) => FEATURED_SECTIONS.includes(id));
  if (featured.length < 2) return sections;

  const orderedFeatured = [lead, ...featured.filter((id) => id !== lead)];
  let nextFeatured = 0;
  return sections.map((id) => (FEATURED_SECTIONS.includes(id) ? orderedFeatured[nextFeatured++] : id));
}

function removeDuplicates(sections: SectionId[]): SectionId[] {
  return [...new Set(sections)];
}

export function orderSections(answers: Answers): SectionId[] {
  const prioritized = putLeadProjectFirst(
    removeDuplicates(matchedSections(answers)),
    FOCUS_LEAD[answers.focus],
  );
  const pinned = [FIRST_SECTION, LAST_SECTION];
  const middle = removeDuplicates([...prioritized, ...DEFAULT_SECTION_ORDER]).filter(
    (id) => !pinned.includes(id),
  );
  return [FIRST_SECTION, ...middle, LAST_SECTION];
}

export function buildPitch(answers: Answers): string {
  return `${COPY.pitch.focus[answers.focus]} ${COPY.pitch.proof[answers.proof]}`;
}

function findAllowed<T extends string>(allowed: readonly T[], value: string | null): T | undefined {
  return allowed.find((option) => option === value);
}

/** Reads quiz answers from a location.search-style string; null unless both are valid. */
export function parseAnswers(search: string): Answers | null {
  const params = new URLSearchParams(search);
  const focus = findAllowed(HIRING_FOCUSES, params.get('for'));
  const proof = findAllowed(PROOF_PREFERENCES, params.get('proof'));
  return focus && proof ? { focus, proof } : null;
}

export function answersToQuery(answers: Answers): string {
  return `?for=${answers.focus}&proof=${answers.proof}`;
}
