import { defineConfig } from 'vitest/config';

/**
 * E2E test configuration for Oak Curriculum SDK
 * Tests that involve real I/O operations (network, filesystem)
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['e2e-tests/**/*.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
  },
});
