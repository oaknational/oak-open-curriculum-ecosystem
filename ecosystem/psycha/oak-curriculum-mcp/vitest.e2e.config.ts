import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['e2e-tests/**/*.e2e.test.ts'],
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    setupFiles: ['dotenv/config'],
  },
});
