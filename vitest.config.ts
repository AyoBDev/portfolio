import { defineConfig } from 'vitest/config';

// Unit tests only; Playwright specs in tests/e2e are run by `npm run test:e2e`.
export default defineConfig({
  test: { include: ['tests/unit/**/*.test.ts'] },
});
