import { defineConfig } from 'tsup';

export default defineConfig({
  // Two entries: index (runs server) + application (importable factory).
  // Matches the official ext-apps pattern of separate main.ts + server.ts.
  entry: { index: 'src/index.ts', application: 'src/application.ts' },
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
