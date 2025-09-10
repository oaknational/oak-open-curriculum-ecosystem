import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  clean: true,
  format: ['esm'],
  dts: true,
  target: 'node20',
  skipNodeModulesBundle: true,
});
