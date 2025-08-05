import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: false,
  platform: 'node',
  target: 'node22',
  shims: false,
  splitting: false,
  keepNames: true,
  treeshake: true,
  external: ['@modelcontextprotocol/sdk', '@notionhq/client', 'dotenv', 'zod'],
  // Add shebang for the executable
  banner: {
    js: '#!/usr/bin/env node',
  },
});
