import { defineConfig } from 'vitest/config';

/**
 * Base Vitest configuration for unit and integration tests
 * All workspace vitest.config.ts files should extend this
 */
export const baseTestConfig = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    // Force process isolation to prevent global state pollution between tests
    // Many tests mutate process.env which causes race conditions in parallel execution
    // TODO: Refactor tests to use dependency injection instead of process.env mutation
    isolate: true,
    pool: 'forks',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.d.ts.map',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
        '**/index.ts', // Often just re-exports
      ],
    },
    // Scripts (`scripts/**`, `build-scripts/**`, `runtime-only-scripts/**`) are
    // intentionally OUTSIDE this include surface — see ADR-168 §5. Scripts get
    // type-check coverage (all-TS rule) but NOT unit tests; a script complex
    // enough to need tests is the signal to promote its logic into `src/`.
    // A `*.test.ts` under `scripts/` does not run by design and must not be
    // "fixed" by widening these globs.
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'coverage', '**/*.e2e.test.ts', 'stryker-tmp'],
  },
});
