import { defineConfig, devices } from '@playwright/test';

/* eslint-disable-next-line no-restricted-syntax -- Playwright config file needs env for test configuration */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3333';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  webServer: {
    command: 'pnpm dev:observe:noauth',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
    env: {
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_dummy',
      CLERK_SECRET_KEY: 'sk_test_dummy',
      DANGEROUSLY_DISABLE_AUTH: 'true',
    },
  },
  use: {
    trace: 'on',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'visual',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        baseURL,
      },
    },
    {
      name: 'widget',
      testDir: './tests/widget',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
      // Widget tests use their own Express test server
    },
  ],
});
