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
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'tests/**/*.test.ts', 'tests/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'coverage', '**/*.e2e.test.ts', 'stryker-tmp'],
  },
});
