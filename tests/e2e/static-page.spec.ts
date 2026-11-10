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
test('Olympus demo video loads only on demand, with controls and sound left to the visitor', async ({ page }) => {
  await page.goto('/?skip=1');
  const video = page.locator('#olympus-vision video');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute('src', '/media/olympus-demo.mp4');
  await expect(video).toHaveAttribute('poster', '/media/olympus-demo-poster.jpg');
  await expect(video).toHaveAttribute('preload', 'none');
  expect(await video.evaluate((v: HTMLVideoElement) => v.controls && !v.autoplay)).toBe(true);
  const res = await page.request.get('/media/olympus-demo.mp4');
  expect(res.status()).toBe(200);
});
test('CareOmni offers a demo login by email, never a public password', async ({ page }) => {
  await page.goto('/?skip=1');
  const request = page.locator('#careomni a[href^="mailto:"]', { hasText: 'Request a demo login' });
  await expect(request).toHaveCount(1);
  expect(decodeURIComponent((await request.getAttribute('href')) ?? '')).toContain('CareOmni demo login');
  await expect(page.locator('#careomni')).not.toContainText(/password/i);
});
test('Olympus demo video has English captions', async ({ page }) => {
  await page.goto('/?skip=1');
  const track = page.locator('#olympus-vision video track[kind="captions"]');
  await expect(track).toHaveAttribute('srclang', 'en');
  const src = await track.getAttribute('src');
  const res = await page.request.get(src ?? '');
  expect(res.status()).toBe(200);
  expect(await res.text()).toMatch(/^WEBVTT/);
});
test('AWS certifications show their official badge images, in the hero and the certifications list', async ({ page }) => {
  await page.goto('/?skip=1');
  const listBadges = page.locator('#certifications img.cert-badge-image');
  await expect(listBadges).toHaveCount(2);
  const heroBadge = page.locator('#hero img.hero-badge-image');
  await expect(heroBadge).toHaveCount(1);
  for (const img of [...(await listBadges.all()), heroBadge]) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    // The certificate name is already in text next to it, so the image is decorative.
    await expect(img).toHaveAttribute('alt', '');
  }
});
