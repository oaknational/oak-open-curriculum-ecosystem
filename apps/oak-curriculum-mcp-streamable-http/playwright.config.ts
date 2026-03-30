import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL for the local MCP server under test.
 *
 * Hardcoded to match the port used by `pnpm dev:observe:noauth`.
 * No `process.env` access — config files follow the same DI
 * principle as product code.
 */
const baseURL = 'http://localhost:3333';

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
      ELASTICSEARCH_URL: 'http://fake-es:9200',
      ELASTICSEARCH_API_KEY: 'fake-api-key-for-playwright',
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
        baseURL,
      },
    },
  ],
});
