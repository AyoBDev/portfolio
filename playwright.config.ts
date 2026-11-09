import { defineConfig, devices } from '@playwright/test';

const PREVIEW_PORT = 4321;

export default defineConfig({
  testDir: 'tests/e2e',
  webServer: {
    command: `npm run build && npm run preview -- --port ${PREVIEW_PORT} --ignore-lock`,
    url: `http://localhost:${PREVIEW_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: { baseURL: `http://localhost:${PREVIEW_PORT}` },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
