import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false, // Skip DTS for now
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  treeshake: true,
  minify: false,
  external: ['@oaknational/mcp-moria'],
});