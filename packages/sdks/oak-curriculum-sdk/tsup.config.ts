import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    // Root-level modules
    'src/*.ts',

    // Client — Oak API client and middleware
    'src/client/**/*.ts',

    // Config — rate limiting, retry
    'src/config/**/*.ts',

    // Types — hand-authored type definitions and helpers
    // Includes src/types/generated/ (managed by pnpm type-gen)
    'src/types/**/*.ts',

    // Public entry points — consumer-facing barrels
    'src/public/**/*.ts',

    // Bulk data — parsing, extractors, generators
    'src/bulk/**/*.ts',

    // MCP — tool definitions, execution, synonyms, resources
    'src/mcp/**/*.ts',

    // Validation — request and response validators
    'src/validation/**/*.ts',

    // Exclude tests from all groups
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: false, // SDK should not bundle dependencies
  platform: 'neutral',
  external: [
    // Keep all dependencies external for SDK
    'zod',
  ],
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
  esbuildOptions(options) {
    options.plugins = options.plugins ?? [];
    options.plugins.push({
      name: 'ensure-js-extensions',
      setup(build) {
        build.onResolve({ filter: /^\./ }, (args) => {
          if (args.path.endsWith('.js') || args.path.endsWith('.json')) {
            return null;
          }
          return { path: `${args.path}.js` };
        });
      },
    });
  },
});
