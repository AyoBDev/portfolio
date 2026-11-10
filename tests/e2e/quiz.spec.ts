import { test, expect } from '@playwright/test';
import { DEFAULT_SECTION_ORDER } from '../../src/content/quizConfig';
import AxeBuilder from '@axe-core/playwright';

test('full flow tailors the page and keeps every section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeHidden();
  await page.getByRole('button', { name: 'Show me why (30 sec)' }).click();
  await page.getByRole('button', { name: 'Backend' }).click();
  await page.getByRole('button', { name: "Production systems I've shipped" }).click();
  await expect(page.locator('[data-pitch]')).not.toBeEmpty();
  const ids = await page.locator('main > section').evaluateAll(s => s.map(e => e.id));
  expect(ids.slice(0, 4)).toEqual(['hero','careomni','olympus-vision','projects']);
  expect(ids).toHaveLength(DEFAULT_SECTION_ORDER.length);
  await expect(page).toHaveURL(/\?for=backend&proof=production$/);
});
test('skip is offered on every question screen and reveals everything', async ({ page }) => {
  await page.goto('/');
  for (const advance of [null, 'Show me why (30 sec)', 'Cloud infrastructure']) {
    if (advance) await page.getByRole('button', { name: advance }).click();
    await expect(page.getByRole('button', { name: 'Skip, show me everything' })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Skip, show me everything' }).click();
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('#hero h1')).toBeFocused();
});
test('back returns to the previous question', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show me why (30 sec)' }).click();
  await page.getByRole('button', { name: 'Cloud infrastructure' }).click();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page.getByRole('heading', { name: 'What are you hiring for?' })).toBeFocused();
});
test('shared URL opens straight to the result; junk URL starts the quiz', async ({ page }) => {
  await page.goto('/?for=systems&proof=certs');
  await expect(page.locator('[data-pitch]')).toBeVisible();
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/?for=banana');
  await expect(page.getByRole('button', { name: 'Show me why (30 sec)' })).toBeVisible();
  expect(errors).toEqual([]);
});
test.describe('keyboard + reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('quiz is keyboard-operable with announced progress and no animation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Show me why (30 sec)' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-label', 'Question 1 of 2');
    await page.getByRole('button', { name: 'Cloud infrastructure' }).focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('heading', { name: 'What would convince you?' })).toBeFocused();
    const ZERO_DURATIONS = ['0s', '0.00001s'];
    const durationsOf = (selector: string) =>
      page.locator(selector).first().evaluate((element) => {
        const style = getComputedStyle(element);
        return { animation: style.animationDuration, transition: style.transitionDuration };
      });
    const step = await durationsOf('[data-step="proof"]');
    expect(ZERO_DURATIONS).toContain(step.animation);
    expect(ZERO_DURATIONS).toContain(step.transition);
    const mascot = await durationsOf('[data-step="proof"] [data-mascot]');
    expect(ZERO_DURATIONS).toContain(mascot.animation);
  });
});
test('no axe violations on each quiz step', async ({ page }) => {
  await page.goto('/');
  expect((await new AxeBuilder({ page }).include('[data-quiz]').analyze()).violations).toEqual([]);
});

// Beyond the brief: the remaining steps and the restore paths.
test.describe('axe on later steps', () => {
  // Reduced motion so axe never measures contrast mid-fade.
  test.use({ reducedMotion: 'reduce' });
  test('no axe violations on the question and result steps', async ({ page }) => {
    await page.goto('/');
    for (const advance of ['Show me why (30 sec)', 'Platform / DevOps', 'The code']) {
      await page.getByRole('button', { name: advance }).click();
      expect((await new AxeBuilder({ page }).include('[data-quiz]').analyze()).violations).toEqual([]);
    }
  });
});
test('result tags the matched sections; start over restores the default page', async ({ page }) => {
  await page.goto('/?for=cloud&proof=certs');
  await expect(page.locator('#certifications [data-match-tag]')).toHaveText('Matches what you asked');
  await expect(page.locator('#hero [data-match-tag]')).toBeEmpty();
  await page.getByRole('button', { name: 'Start over' }).click();
  await expect(page.getByRole('button', { name: 'Show me why (30 sec)' })).toBeVisible();
  await expect(page.locator('main')).toBeHidden();
  await expect(page.locator('[data-match-tag]:not(:empty)')).toHaveCount(0);
  await expect(page).toHaveURL(/\/$/);
  const ids = await page.locator('main > section').evaluateAll(s => s.map(e => e.id));
  expect(ids).toEqual(['hero', 'olympus-vision', 'careomni', 'projects', 'experience', 'certifications', 'skills', 'writing', 'testimonials', 'contact']);
});
test('back from the result returns to the proof question with the default order', async ({ page }) => {
  await page.goto('/?for=backend&proof=production');
  await page.locator('[data-step="result"]').getByRole('button', { name: 'Back', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'What would convince you?' })).toBeFocused();
  await expect(page).toHaveURL(/\/$/);
  const ids = await page.locator('main > section').evaluateAll(s => s.map(e => e.id));
  expect(ids.slice(0, 3)).toEqual(['hero', 'olympus-vision', 'careomni']);
});

test.describe('failsafe when the quiz script does not run', () => {
  const FAILSAFE_WAIT_MS = 3000;
  test('blocked controller still reveals the full page', async ({ page }) => {
    await page.route('**/_astro/Quiz.astro*.js', (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible({ timeout: FAILSAFE_WAIT_MS });
    await expect(page.locator('#hero h1')).toBeVisible();
  });
  test('controller that throws still reveals the full page', async ({ page }) => {
    // Breaks the controller's first DOM lookup so initQuiz throws.
    await page.addInitScript(() => {
      const original = Document.prototype.querySelector;
      Document.prototype.querySelector = function (this: Document, selector: string) {
        if (selector === '[data-quiz]') throw new Error('simulated quiz failure');
        return original.call(this, selector);
      } as typeof original;
    });
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible({ timeout: FAILSAFE_WAIT_MS });
    await expect(page.locator('#hero h1')).toBeVisible();
  });
  test('controller that loads after the timeout never takes the page over', async ({ page }) => {
    const LATE_LOAD_DELAY_MS = 3000;
    await page.route('**/_astro/Quiz.astro*.js', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, LATE_LOAD_DELAY_MS));
      await route.continue();
    });
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible({ timeout: FAILSAFE_WAIT_MS });
    // Give the late controller time to run, then confirm it left the page alone.
    await page.waitForTimeout(LATE_LOAD_DELAY_MS + 1000);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('[data-quiz]')).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/quiz-active/);
  });
});

