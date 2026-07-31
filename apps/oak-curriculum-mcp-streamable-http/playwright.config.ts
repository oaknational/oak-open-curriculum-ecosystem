import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL for the MCP server under test.
 *
 * Uses port 3334 (not the default 3333) to avoid clashing with
 * `dev:observe:noauth` when Turbo runs tasks in parallel. No
 * `process.env` access — config files follow the same DI principle
 * as product code.
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
      // The observe-noauth mode this webServer runs FORCES
      // DANGEROUSLY_DISABLE_AUTH=true after spreading this block
      // (operations/development/http-dev-contract.ts resolveServerEnv), so
      // the harness must also pin the analytics axis that flag constrains:
      // the app refuses a posthog selection under disabled auth
      // (src/env-product-analytics.ts), and without this pin the
      // developer's .env.local selection reaches the server and it cannot
      // start (MCP-359). Playwright spreads this block over the runner's
      // ambient process env, and processEnv is the top layer in resolveEnv,
      // so the pin beats every ambient channel. '[]' is the shared schema's
      // own default — stdout-only baseline.
      OBSERVABILITY_SINKS: '[]',
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
