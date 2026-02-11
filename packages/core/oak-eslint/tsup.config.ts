import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: true,
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
  external: [
    // Node built-ins
    'fs',
    'path',
    'node:fs',
    'node:path',
    // Core tools - consumers provide these
    'eslint',
    'typescript',
    // ESLint plugins and configs - no need to bundle, they're runtime dependencies
    // Bundling them causes eval warnings from browserslist (used for browser targets)
    '@eslint/js',
    '@next/eslint-plugin-next',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@typescript-eslint/utils',
    'eslint-config-next',
    'eslint-config-prettier',
    'eslint-plugin-import-x',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-sonarjs',
    'eslint-plugin-tsdoc',
    'typescript-eslint',
    'globals',
    'minimatch',
  ],
});
