import { defineConfig, devices } from '@playwright/test';

/**
 * Base URLs for the MCP server under test.
 *
 * Uses ports 3334/3335 (not the default 3333) to avoid clashing with
 * `dev:observe:noauth` when Turbo runs tasks in parallel. No
 * `process.env` access — config files follow the same DI principle
 * as product code.
 *
 * Two servers, because `THEME_SELECTOR_ENABLED` is resolved once at startup
 * into runtime config (ADR-217 §5) — it is not a per-request switch, so the
 * only way to exercise the flag-on page is to boot a second server with it on.
 * The default surface and the opt-in surface are genuinely different builds of
 * the page, and each needs its own proof.
 */
const baseURL = 'http://localhost:3334';
const themeControlURL = 'http://localhost:3335';
/**
 * The appearance suite runs against the BUILT artefact, on its own port.
 *
 * @remarks
 * Baselines are captured by `scripts/update-visual-baselines.ts`, which runs
 * `node dist/index.js` inside the CI-matching image — so the gate has to
 * compare against that same surface. Pointing it at the dev server instead
 * would compare a loader-assisted render against a bundled one and call any
 * difference a visual regression.
 */
const appearanceURL = 'http://localhost:3336';

const serverEnv = {
  OAK_API_KEY: 'test-key',
  CLERK_PUBLISHABLE_KEY: 'pk_test_dummy',
  CLERK_SECRET_KEY: 'sk_test_dummy',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-playwright',
  SENTRY_MODE: 'off',
};

export const sharedExpect = {
  timeout: 5_000,
  toHaveScreenshot: {
    // Calibrated against a deliberate regression, not guessed. These are
    // full-page shots of a ~4600px-tall page, so a band-sized change is a tiny
    // fraction of the frame: repainting the whole masthead moved 1.04% of
    // desktop pixels and 0.93% of mobile ones. At a 1% ratio the desktop cells
    // caught it and the mobile cells did not — a threshold that lets a
    // recoloured masthead through is not a gate. 0.1% still absorbs
    // antialiasing noise while catching anything of that size.
    maxDiffPixelRatio: 0.001,
    animations: 'disabled' as const,
    caret: 'hide' as const,
  },
};

export default defineConfig({
  timeout: 30_000,
  expect: sharedExpect,
  reporter: [['list']],
  webServer: [
    {
      command: 'pnpm dev:observe:noauth',
      url: baseURL,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { ...serverEnv, PORT: '3334' },
    },
    {
      command: 'pnpm dev:observe:noauth',
      url: themeControlURL,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { ...serverEnv, PORT: '3335', THEME_SELECTOR_ENABLED: 'true' },
    },
    {
      command: 'node dist/index.js',
      url: appearanceURL,
      reuseExistingServer: true,
      timeout: 60_000,
      env: { ...serverEnv, PORT: '3336' },
    },
  ],
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
    {
      // Its own project, and deliberately not part of `test:ui`: screenshot
      // baselines are platform-specific, and these are generated on Linux to
      // match CI. Running them on macOS would compare a different font
      // rasteriser and fail for a reason unrelated to the page. Locally, use
      // `pnpm test:visual:baselines`, which runs them in the CI-matching image.
      name: 'appearance',
      testDir: './tests/appearance',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: appearanceURL,
      },
    },
    {
      name: 'theme-control',
      testDir: './tests/theme-control',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: themeControlURL,
      },
    },
  ],
});
