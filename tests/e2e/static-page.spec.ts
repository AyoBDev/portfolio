import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('all sections render in default order and the quiz is hidden', async ({ page }) => {
    await page.goto('/');
    const ids = await page.locator('main[data-sections] > section').evaluateAll((s) => s.map((e) => e.id));
    expect(ids).toEqual(['hero', 'olympus-vision', 'careomni', 'projects', 'experience', 'certifications', 'skills', 'writing', 'contact']);
    await expect(page.locator('[data-quiz]')).toBeHidden();
    await expect(page.getByText('Private repo · walkthrough on request')).toBeVisible();
    await expect(page.getByText('Internship')).toBeVisible();
    await expect(page.getByText('4.39 / 5.0')).toBeVisible();
  });
});
test('no axe violations on the full page', async ({ page }) => {
  await page.goto('/?skip=1');
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  expect(r.violations).toEqual([]);
});
test('no horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/?skip=1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});
test('external article links are safe', async ({ page }) => {
  await page.goto('/?skip=1');
  for (const a of await page.locator('#writing a[href^="https://medium.com"]').all())
    expect(await a.getAttribute('rel')).toContain('noopener');
});
test('featured projects link to their live site and verified certs link to Credly', async ({ page }) => {
  await page.goto('/?skip=1');
  const live = page.locator('#olympus-vision a', { hasText: 'Live site' });
  await expect(live).toHaveAttribute('href', 'https://www.olympusvisions.com/');
  await expect(page.locator('#careomni a', { hasText: 'Live site' })).toHaveCount(0);
  await expect(page.locator('#certifications a[href^="https://www.credly.com/badges/"]')).toHaveCount(2);
});
