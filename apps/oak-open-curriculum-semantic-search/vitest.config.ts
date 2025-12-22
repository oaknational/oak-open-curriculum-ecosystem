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
    // Restored to proper isolation after completing DI refactoring.
    // Tests no longer mutate global state (window.matchMedia, etc.).
    // See: test-isolation-architecture-fix.md
    isolate: true,
    pool: 'forks',
    exclude: [
      '**/*.e2e.test.ts',
      'node_modules',
      '.next',
      'dist',
      // Sandbox harness test causes OOM in forked worker due to heavy import graph.
      // Skipped as this Next.js app is being retired in favor of SDK+CLI.
      // See: .agent/plans/semantic-search/phase-4-search-sdk-and-cli.md
      'src/lib/indexing/sandbox-harness.unit.test.ts',
    ],
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
