import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/create-search-sdk.ts',
    'src/types/index.ts',
    'src/types/sdk.ts',
    'src/types/retrieval.ts',
    'src/types/retrieval-params.ts',
    'src/types/retrieval-results.ts',
    'src/types/admin.ts',
    'src/types/admin-types.ts',
    'src/types/observability.ts',
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
  external: ['zod', '@elastic/elasticsearch', '@oaknational/oak-curriculum-sdk'],
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
