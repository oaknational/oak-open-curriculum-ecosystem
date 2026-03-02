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
    // Restored to proper isolation after completing DI refactoring.
    // Tests no longer mutate global state.
    // See: test-isolation-architecture-fix.md
    isolate: true,
    pool: 'forks',
    exclude: [
      '**/*.e2e.test.ts',
      'node_modules',
      'dist',
      // Ingest harness test causes OOM in forked worker due to heavy import graph.
      // Skipped as this workspace is being extracted into SDK+CLI.
      // See: .agent/plans/semantic-search/active/search-sdk-cli.plan.md
      'src/lib/indexing/ingest-harness.unit.test.ts',
    ],
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
