import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    // Public barrel and factories
    'src/index.ts',
    'src/create-search-sdk.ts',
    'src/create-search-retrieval.ts',

    // Type definitions — service interfaces, params, results
    'src/types/**/*.ts',

    // Service implementations
    'src/retrieval/**/*.ts',
    'src/admin/**/*.ts',
    'src/observability/**/*.ts',

    // Internal infrastructure
    'src/internal/**/*.ts',

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
  external: ['zod', '@elastic/elasticsearch'],
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
