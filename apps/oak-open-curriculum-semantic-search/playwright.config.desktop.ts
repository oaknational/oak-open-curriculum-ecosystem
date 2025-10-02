import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/visual',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list']],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    env: {
      ...process.env,
      SEMANTIC_SEARCH_USE_FIXTURES: 'true',
      NEXT_DISABLE_DEV_ERRORS: '1',
      NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: 'true',
    },
  },
  use: {
    baseURL,
    trace: 'on',
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'off',
  },
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
