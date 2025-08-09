import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  sourcemap: true,
  clean: true,
  minify: false,
  shims: true,
  external: ['@oaknational/mcp-moria'],
  platform: 'node',
  target: 'node22',
});
