import { defineConfig, devices } from '@playwright/test';

/** Dev server port - defaults to 3003 to avoid conflicts with other Next.js apps */
const port = process.env.SEMANTIC_SEARCH_PORT ?? '3003';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  reportSlowTests: {
    max: 10,
    threshold: 10_000,
  },
  testDir: './tests/visual',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [['list']],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 60_000,
    env: {
      ...process.env,
      SEMANTIC_SEARCH_PORT: port,
      SEMANTIC_SEARCH_USE_FIXTURES: 'true',
      NEXT_DISABLE_DEV_ERRORS: '1',
      NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE: 'true',
      NEXT_PUBLIC_BASE_URL: baseURL,
    },
  },
  use: {
    baseURL,
    trace: 'on',
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
