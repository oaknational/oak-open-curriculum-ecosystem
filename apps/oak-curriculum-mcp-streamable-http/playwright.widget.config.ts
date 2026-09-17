/**
 * Playwright configuration for widget-level tests.
 *
 * The only Playwright configuration in this workspace since 2026-08-20, when
 * `playwright.config.ts` and its landing-page visual suite were removed with
 * the page. The widget Vite dev server requires no MCP server or environment
 * variables — it is a self-contained React app.
 *
 * The suite's server rides a deterministic per-worktree port derived from
 * this workspace's absolute path (the MCP-384 pattern, owner-ruled: the
 * harness adapts to the machine), so the run coexists with anything
 * already serving on the host — and `reuseExistingServer: false` means it
 * can never green against ANOTHER tree's widget, which a fixed port with
 * reuse enabled silently allows in a many-worktree estate. Derivation,
 * not probing: Playwright evaluates this config once in the main process
 * and again in every worker, so the value must be stable across
 * evaluations. The derived range (5200-5599) keeps clear of the estate's
 * fixed dev ports (3010, 3020, 3333/3334, 5173) and the showcase's
 * derived range (4600-4999). The human `dev` flow keeps its fixed port.
 *
 * Tests cover:
 * - Structural rendering for each widget page (no screenshot baselines
 *   yet; visual regression is a tracked follow-up)
 * - WCAG 2.2 AA accessibility via axe-core (light, dark, and
 *   forced-colours themes — forced colours is where a wrongly filled
 *   wordmark fails TOTALLY, black-on-black, so it runs as a first-class
 *   project, MCP-368)
 * - Token demo page rendering
 */
import { createHash } from 'node:crypto';

import { defineConfig, devices } from '@playwright/test';

const digest = createHash('sha256')
  .update(import.meta.dirname)
  .digest();
const port = 5200 + (digest.readUInt16BE(0) % 400);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // A stray test.only would silently narrow test:widget:ui — and empty
  // test:widget:a11y if it landed on a non-a11y test (the same @a11y grep
  // split the showcase config guards). Fail loudly everywhere instead.
  forbidOnly: true,
  reporter: [['list']],
  webServer: {
    command: `vite dev --config widget/vite.config.ts --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
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
    {
      name: 'widget-forced-colors',
      testDir: './tests/widget',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
        colorScheme: 'dark',
        // Playwright 1.62 exposes forcedColors only as a context option
        // (the test-options key was removed and unknown keys are silently
        // ignored). Two protections, complementary: this file is inside
        // tsconfig.lint.json's type-check, so an unknown `use` key is a
        // compile error; and the emulation-liveness spec in
        // oak-banner.spec.ts proves a key that types still actually
        // applies per project.
        contextOptions: { forcedColors: 'active' },
      },
    },
  ],
});
