import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    passWithNoTests: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
    include: ['**/*.unit.test.ts', '**/*.integration.test.ts', '**/*.api.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'e2e-tests/**'],
  },
});
