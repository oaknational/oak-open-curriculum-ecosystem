import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/testing/provider-contract.ts'],
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: false,
  platform: 'neutral',
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
