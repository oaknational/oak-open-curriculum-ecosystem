import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL for the MCP server under test.
 *
 * Uses port 3334 (not the default 3333) to avoid clashing with
 * `dev:observe:noauth` or `smoke:dev:stub` when Turbo runs tasks
 * in parallel. No `process.env` access — config files follow the
 * same DI principle as product code.
 */
const baseURL = 'http://localhost:3334';

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
      PORT: '3334',
      OAK_API_KEY: 'test-key',
      CLERK_PUBLISHABLE_KEY: 'pk_test_dummy',
      CLERK_SECRET_KEY: 'sk_test_dummy',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-playwright',
      SENTRY_MODE: 'off',
    },
  },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'visual',
      testDir: './tests/visual',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
      },
    },
  ],
});
