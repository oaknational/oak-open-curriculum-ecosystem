import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { 'bin/oaksearch': 'bin/oaksearch.ts' },
  format: ['esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: true,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
  treeshake: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // Keep all node_modules external — resolved at runtime
  external: [/node_modules/],
});
