/**
 * Vitest Configuration for Oak Open Curriculum Semantic Search
 *
 * Extends the base vitest config and adds Next.js specific settings.
 * Focuses on unit and integration tests with no network calls.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test.setup.ts'],
    include: ['**/*.unit.test.{ts,tsx}', '**/*.integration.test.{ts,tsx}'],
    // Force process isolation to prevent global state pollution between tests
    // TODO: Refactor tests to use dependency injection instead of process.env mutation
    isolate: true,
    pool: 'forks',
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
});
