import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    passWithNoTests: false,
    isolate: true,
    pool: 'forks',
    include: ['**/*.integration.test.ts', '**/*.unit.test.ts'],
    exclude: ['node_modules', 'dist', '**/*.e2e.test.ts'],
  },
});
