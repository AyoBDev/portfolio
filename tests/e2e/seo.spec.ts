import { test, expect } from '@playwright/test';
import { SITE_URL } from '../../site-url.mjs';

test('home page head is SEO-complete', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page).toHaveTitle(/Ayomikun Ayobami.*Systems & Cloud Engineer/);
  for (const sel of ['meta[name="description"]', 'link[rel="canonical"]', 'meta[property="og:image"]', 'meta[property="og:image:width"][content="1200"]', 'meta[property="og:image:height"][content="630"]', 'meta[property="og:image:alt"]', 'meta[name="twitter:image:alt"]', 'meta[name="twitter:card"]', 'script[type="application/ld+json"]'])
    await expect(page.locator(sel)).toHaveCount(1);
});

test('robots.txt points at the sitemap on the configured site URL', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text();
  expect(body).toContain(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
});
