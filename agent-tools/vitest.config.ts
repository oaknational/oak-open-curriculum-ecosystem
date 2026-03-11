import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    isolate: true,
    pool: 'forks',
    include: ['tests/**/*.test.ts'],
    passWithNoTests: false,
  },
});
