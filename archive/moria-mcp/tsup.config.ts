import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/types/index.ts', 'src/interfaces/index.ts', 'src/patterns/index.ts'],
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: true, // Bundle to resolve all imports
  external: [], // Bundle everything
  tsconfig: './tsconfig.build.json',
});
