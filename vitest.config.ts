import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@chora/stroma': resolve(__dirname, './src/chora/stroma'),
      '@chora/aither': resolve(__dirname, './src/chora/aither'),
      '@chora/phaneron': resolve(__dirname, './src/chora/phaneron'),
      '@chora/eidola': resolve(__dirname, './src/chora/eidola'),
      '@organa/notion': resolve(__dirname, './src/organa/notion'),
      '@organa/mcp': resolve(__dirname, './src/organa/mcp'),
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
    exclude: ['node_modules', 'dist', 'coverage', 'e2e-tests/**'],
  },
});
