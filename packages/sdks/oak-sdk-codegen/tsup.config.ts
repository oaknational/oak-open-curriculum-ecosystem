import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', '!src/**/*.test.ts', '!src/**/*.spec.ts'],
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
