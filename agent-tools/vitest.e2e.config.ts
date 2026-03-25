import { defineConfig } from 'vitest/config';

/**
 * E2E test configuration for agent-tools.
 *
 * Does not extend `vitest.e2e.config.base.ts` because:
 * - E2E tests live under `tests/` (not `e2e-tests/`), requiring different include paths
 * - CLI smoke tests spawn child processes (`pnpm tsx`), not network IO — the base
 *   `test.setup.no-network.ts` guard is unnecessary
 *
 * Uses 60s timeout for CI headroom (child process startup is slow under resource pressure).
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    include: ['tests/**/*.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    testTimeout: 60000,
    hookTimeout: 30000,
    retry: 0,
  },
});
