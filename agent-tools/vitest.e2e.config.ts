import { defineConfig } from 'vitest/config';

/**
 * E2E test configuration for agent-tools.
 *
 * Does not extend `vitest.e2e.config.base.ts` because:
 * - E2E tests live under `tests/` (not `e2e-tests/`), requiring different include paths
 * - agent-tools currently has no E2E tests; CLI process and filesystem checks
 *   belong to smoke/manual validation, not regular CI E2E gates
 *
 * Keeps the standard E2E timeout for any future no-IO system-level tests.
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
