import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'src/index': 'src/index.ts' },
  sourcemap: true,
  clean: true,
  format: ['esm'],
  dts: true,
  target: 'es2023',
  skipNodeModulesBundle: true,
});
