import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('selecting a node explains it', async ({ page }) => {
  await page.goto('/?skip=1');
  await page.locator('[data-node="edge"]').click();
  await expect(page.locator('#diagram-detail')).toContainText('X.509');
  await expect(page.locator('[data-node="edge"]')).toHaveAttribute('aria-pressed', 'true');
});

test('selecting another node moves the selection', async ({ page }) => {
  await page.goto('/?skip=1');
  await page.locator('[data-node="edge"]').click();
  await page.locator('[data-node="storage"]').click();
  await expect(page.locator('#diagram-detail')).toContainText('Glacier');
  await expect(page.locator('[data-node="storage"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-node="edge"]')).toHaveAttribute('aria-pressed', 'false');
});

test('incident answer reveals the real fix', async ({ page }) => {
  await page.goto('/?skip=1');
  await expect(page.locator('[data-incident-fix]')).toBeHidden();
  await page.getByLabel(/Route 53/).check();
  await expect(page.locator('[data-incident-fix]')).toContainText('Terraform');
});

test('a wrong incident answer still reveals the fix with gentle feedback', async ({ page }) => {
  await page.goto('/?skip=1');
  await page.getByLabel(/Restart the ECS service/).check();
  await expect(page.locator('[data-incident-feedback]')).toContainText(/Close/);
  await expect(page.locator('[data-incident-fix]')).toBeVisible();
});

test('diagram reflows without horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/?skip=1');
  await page.locator('[data-node="dashboard"]').click();
  await expect(page.locator('#diagram-detail')).toContainText('Fastify');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('no axe violations with a node selected and the incident answered', async ({ page }) => {
  await page.goto('/?skip=1');
  await page.locator('[data-node="kvs"]').click();
  await page.getByLabel(/Route 53/).check();
  const results = await new AxeBuilder({ page })
    .include('#olympus-vision')
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test.describe('no JS', () => {
  test.use({ javaScriptEnabled: false });
  test('diagram details and incident fix are readable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#olympus-vision dl')).toBeVisible();
    await expect(page.locator('[data-incident-fix]')).toBeVisible();
  });
});
