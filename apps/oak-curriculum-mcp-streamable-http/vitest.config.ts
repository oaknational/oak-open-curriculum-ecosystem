import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'build-scripts/**/*.unit.test.ts',
      'build-scripts/**/*.integration.test.ts',
      'build-scripts/**/*.unit.test.mjs',
      'build-scripts/**/*.integration.test.mjs',
      'operations/**/*.unit.test.ts',
      'operations/**/*.integration.test.ts',
      'src/**/*.unit.test.ts',
      'src/**/*.integration.test.ts',
      'smoke-tests/**/*.unit.test.ts',
    ],
    exclude: ['**/*.e2e.test.ts', '../../.agent/reference/**'],
    globals: true,
    setupFiles: ['src/test.setup.ts'],
  },
});
