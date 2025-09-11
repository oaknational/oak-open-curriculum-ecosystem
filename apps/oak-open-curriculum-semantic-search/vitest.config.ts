/**
 * Vitest Configuration for Oak Open Curriculum Semantic Search
 *
 * Extends the base vitest config and adds Next.js specific settings.
 * Focuses on unit and integration tests with no network calls.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test.setup.ts'],
    include: ['**/*.unit.test.ts', '**/*.integration.test.ts'],
    exclude: ['**/*.e2e.test.ts', 'node_modules', '.next', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
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
  // No TS path aliases; use relative imports to match workspace policy
});
