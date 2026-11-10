import { afterEach, beforeEach, expect, test, vi } from 'vitest';

const DEFAULT_URL = 'https://ayomikun-ayobami.pages.dev';

async function loadSiteUrl(): Promise<string> {
  vi.resetModules();
  return (await import('../../site-url.mjs')).SITE_URL;
}

beforeEach(() => {
  vi.stubEnv('PUBLIC_SITE_URL', '');
  vi.stubEnv('SITE_URL', '');
  delete process.env.PUBLIC_SITE_URL;
  delete process.env.SITE_URL;
});
afterEach(() => vi.unstubAllEnvs());

test('defaults to the pages.dev address', async () => {
  expect(await loadSiteUrl()).toBe(DEFAULT_URL);
});
test('PUBLIC_SITE_URL overrides the default', async () => {
  process.env.PUBLIC_SITE_URL = 'https://example.com';
  expect(await loadSiteUrl()).toBe('https://example.com');
});
test('PUBLIC_SITE_URL wins over SITE_URL', async () => {
  process.env.PUBLIC_SITE_URL = 'https://public.example.com';
  process.env.SITE_URL = 'https://legacy.example.com';
  expect(await loadSiteUrl()).toBe('https://public.example.com');
});
test('SITE_URL still works as a fallback', async () => {
  process.env.SITE_URL = 'https://legacy.example.com';
  expect(await loadSiteUrl()).toBe('https://legacy.example.com');
});
