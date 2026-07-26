import { defineConfig, devices } from '@playwright/test';

import { sharedExpect } from './playwright.config.js';

/**
 * Playwright configuration for regenerating visual baselines inside the
 * CI-matching Linux container.
 *
 * @remarks
 * A separate config rather than an environment switch in the main one, so the
 * main config keeps its no-ambient-reads property: the base URL and the absence
 * of a `webServer` are the two things that differ, and both are declarations
 * here rather than branches there.
 *
 * `scripts/update-visual-baselines.ts` starts the built server itself inside
 * the container before invoking this config, which is why nothing is launched
 * from here. Everything is `localhost` in one container — see that script for
 * why reaching a host-side server was abandoned.
 */
export default defineConfig({
  timeout: 30_000,
  expect: sharedExpect,
  reporter: [['list']],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'appearance',
      testDir: './tests/appearance',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3336',
      },
    },
  ],
});
