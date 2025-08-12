import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from repo root
config({ path: resolve(__dirname, '../../../.env') });

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
  },
});
