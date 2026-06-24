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
    // Run each test file isolated in a worker thread. The no-global-state testing
    // rule (testing-strategy.md / principles.md, ESLint-enforced) removed the
    // process.env race that previously forced the slower per-file process fork
    // (`pool: 'forks'`); `isolate: true` keeps per-file module isolation within the
    // thread pool. Verified race-free: full suite green across repeated threaded runs.
    isolate: true,
    pool: 'threads',
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
