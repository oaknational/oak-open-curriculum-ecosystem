import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['e2e-tests/**/*.e2e.test.ts'],
    testTimeout: 30000, // E2E tests may take longer
    hookTimeout: 30000,
  },
});
