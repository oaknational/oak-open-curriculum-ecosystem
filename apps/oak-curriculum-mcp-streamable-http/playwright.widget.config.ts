/**
 * Playwright configuration for widget-level tests.
 *
 * Separate from `playwright.config.ts` (MCP server landing page tests).
 * The widget Vite dev server serves at port 5174 and requires no MCP
 * server or environment variables — it is a self-contained React app.
 *
 * Tests cover:
 * - Visual regression for each widget page
 * - WCAG 2.2 AA accessibility via axe-core (both light and dark themes)
 * - Token demo page rendering
 */
import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://localhost:5174';

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  webServer: {
    command: 'vite dev --config widget/vite.config.ts --port 5174',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 30_000,
  },
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'widget-light',
      testDir: './tests/widget',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
        colorScheme: 'light',
      },
    },
    {
      name: 'widget-dark',
      testDir: './tests/widget',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
        colorScheme: 'dark',
      },
    },
  ],
});
