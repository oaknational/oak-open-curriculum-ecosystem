import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.unit.test.ts', 'src/**/*.integration.test.ts'],
    exclude: ['src/**/*.e2e.test.ts'],
    globals: true,
    setupFiles: ['src/test.setup.ts'],
  },
});
