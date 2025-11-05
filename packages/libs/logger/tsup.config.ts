import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    node: 'src/node.ts',
  },
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
  external: ['fs', 'path', 'node:fs', 'node:path'],
});
