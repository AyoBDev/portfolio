import { expect, test } from '@playwright/test';

const EMAIL = 'ayobamitunmise99@gmail.com';

test('copy email reports success', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?skip=1');
  await page.locator('#hero [data-copy-email]').click();
  await expect(page.locator('#hero [role="status"]')).toHaveText('Copied');
});

test('copy email falls back when clipboard is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined });
  });
  await page.goto('/?skip=1');
  await page.locator('#hero [data-copy-email]').click();
  await expect(page.locator('#hero [role="status"]')).toHaveText(/Press (Ctrl|⌘)\+C/);
  expect(await page.evaluate(() => String(window.getSelection()))).toBe(EMAIL);
});

test('copy email does not say Copied when the write is rejected', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('denied')) },
    });
  });
  await page.goto('/?skip=1');
  await page.locator('#contact [data-copy-email]').click();
  await expect(page.locator('#contact [role="status"]')).toHaveText(/Press (Ctrl|⌘)\+C/);
});

test('each section has its own email and copy buttons with the mailto link', async ({ page }) => {
  await page.goto('/?skip=1');
  for (const id of ['hero', 'contact']) {
    await expect(page.locator(`#${id} a[href^="mailto:${EMAIL}?subject="]`)).toBeVisible();
    await expect(page.locator(`#${id} [data-email-text]`)).toHaveText(EMAIL);
  }
});

test('sticky email button is visible after scrolling to any section', async ({ page }) => {
  await page.goto('/?skip=1');
  for (const id of ['projects', 'writing']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator('[data-sticky-email] a[href^="mailto:"]')).toBeInViewport();
  }
});

test('anchor target lands below the sticky bar on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/?skip=1#contact');
  await page.waitForTimeout(300);
  const barBottom = await page.locator('[data-sticky-email]').evaluate((el) => el.getBoundingClientRect().bottom);
  const headingTop = await page.locator('#contact h2').first().evaluate((el) => el.getBoundingClientRect().top);
  expect(headingTop).toBeGreaterThanOrEqual(barBottom);
});
