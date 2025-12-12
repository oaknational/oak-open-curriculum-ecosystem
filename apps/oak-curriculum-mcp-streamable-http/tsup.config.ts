import { defineConfig } from 'tsup';

export default defineConfig({
  // Entry creates dist/src/index.js to match package.json#main for Vercel Express
  entry: { 'src/index': 'src/index.ts' },
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  minify: false,
  bundle: true,
  tsconfig: './tsconfig.build.json',
  // Exclude test files from build
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
  treeshake: true,
  // Keep all node_modules external - they're installed separately on Vercel
  external: [/node_modules/],
});
