import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@/*': resolve(__dirname, './src/*'),
      '@organa/*': resolve(__dirname, './src/organa/*'),
      '@psychon/*': resolve(__dirname, './src/psychon/*'),
    },
  },
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
    exclude: ['node_modules', 'dist', 'coverage'],
  },
});
