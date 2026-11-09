import { test, expect } from '@playwright/test';

test('mascot is decorative and never the only text', async ({ page }) => {
  await page.goto('/');
  const imgs = page.locator('[data-mascot] img');
  expect(await imgs.count()).toBeGreaterThan(0);
  for (const img of await imgs.all()) expect(await img.getAttribute('alt')).toBe('');
});

test('bands are headings with brand colours', async ({ page }) => {
  await page.goto('/');
  const band = page.locator('[data-band]').first();
  expect(await band.evaluate((e) => e.tagName)).toMatch(/H2|H3/);
  expect(await band.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(16, 44, 64)');
});
