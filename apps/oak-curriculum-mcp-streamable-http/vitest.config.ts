import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: [
      'src/**/*.unit.test.ts',
      'src/**/*.integration.test.ts',
      'smoke-tests/**/*.unit.test.ts',
    ],
    exclude: ['src/**/*.e2e.test.ts', '../../.agent/reference/**'],
    globals: true,
    setupFiles: ['src/test.setup.ts'],
  },
});
