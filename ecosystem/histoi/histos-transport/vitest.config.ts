import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    clearMocks: true,
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['node_modules/', 'dist/', '*.config.ts'],
    },
  },
});
