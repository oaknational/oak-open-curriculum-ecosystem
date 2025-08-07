import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/**', 'dist/**', '*.config.ts', 'tests/**'],
    },
  },
  resolve: {
    alias: {
      '@oaknational/mcp-moria': path.resolve(
        __dirname,
        '../../../moria/@oaknational/mcp-moria/src',
      ),
    },
  },
});
