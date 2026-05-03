/**
 * Vitest configuration for `*.smoke.test.ts` files.
 *
 * @remarks
 * Smoke tests verify a running server's behaviour over network IO
 * against a base URL the canonical harness binds and injects. They
 * are a third Vitest category alongside unit and E2E (per
 * `there-is-no-time-hashed-starfish.plan.md` §A4 — testing-strategy
 * amendment authored after this config lands).
 *
 * This config is invoked exclusively by the smoke harness CLI
 * (`smoke-tests/harness/cli.ts`). Direct `pnpm exec vitest` invocation
 * with this config will fail fast at config resolution because
 * `SMOKE_BASE_URL` is not set in the parent env — that is the desired
 * contract: smoke tests are not part of the normal `pnpm test` lane.
 *
 * The composition root (this file) reads `process.env.SMOKE_BASE_URL`
 * once at config resolution time (per `testing-strategy.md` §"Smoke
 * composition roots may read ambient env"). The value is injected
 * into tests via Vitest's typed `provide` mechanism. Test files
 * NEVER touch `process.env`.
 */

import { defineConfig } from 'vitest/config';

const smokeBaseUrl = readSmokeBaseUrlOrFail();

/**
 * Smoke vitest config does NOT extend `baseE2EConfig` because that base
 * installs `test.setup.no-network.ts` to block network IO — smoke tests
 * deliberately make network calls against the harness-bound server. A
 * `mergeConfig` override of `setupFiles` would concatenate (Vitest's
 * default array-merge semantics) rather than replace, leaving the
 * no-network guard active. Authoring the config standalone keeps the
 * smoke contract honest.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['smoke-tests/**/*.smoke.test.ts'],
    exclude: [
      '**/*.e2e.test.ts',
      '**/*.unit.test.ts',
      '**/*.integration.test.ts',
      'node_modules',
      'dist',
      'coverage',
    ],
    setupFiles: [],
    provide: { smokeBaseUrl },
    passWithNoTests: false,
    testTimeout: 60000,
    hookTimeout: 30000,
    retry: 0,
  },
});

function readSmokeBaseUrlOrFail(): string {
  const value = process.env.SMOKE_BASE_URL;
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      'SMOKE_BASE_URL is required when invoking vitest.smoke.config.ts; ' +
        'this config is invoked exclusively by smoke-tests/harness/cli.ts ' +
        'which sets the variable from the harness-bound server URL.',
    );
  }
  return value;
}
