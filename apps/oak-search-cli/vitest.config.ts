/**
 * Vitest Configuration for Oak Open Curriculum Semantic Search
 *
 * Focuses on unit and integration tests with no network calls.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test.setup.ts'],
    include: ['**/*.unit.test.ts', '**/*.integration.test.ts'],
    // DI refactoring mostly complete. Logger module-level state
    // (configureLogLevel) remains — tracked as cli-logger-di-audit.
    // See: test-isolation-architecture-fix.md
    isolate: true,
    pool: 'forks',
    exclude: ['**/*.e2e.test.ts', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
        'test.setup.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
});
