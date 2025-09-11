import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/client/index.ts',
    'src/client/oak-base-client.ts',
    'src/client/middleware/index.ts',
    'src/client/middleware/auth.ts',
    'src/config/index.ts',
    'src/types/index.ts',
    'src/types/helpers.ts',
    'src/types/search-index.ts',
    'src/types/search-response-guards.ts',
    'src/types/generated/api-schema/api-paths-types.ts',
    'src/types/generated/api-schema/api-schema-base.ts',
    'src/types/generated/api-schema/path-parameters.ts',
    'src/types/generated/api-schema/path-utils.ts',
    'src/types/generated/api-schema/response-map.ts',
    'src/types/generated/api-schema/mcp-tools/index.ts',
    'src/types/generated/api-schema/mcp-tools/types.ts',
    'src/types/generated/api-schema/mcp-tools/lib.ts',
    'src/types/generated/api-schema/mcp-tools/tools/*.ts',
    'src/validation/index.ts',
    'src/validation/request-validators.ts',
    'src/validation/response-validators.ts',
    'src/validation/types.ts',
    'src/types/generated/zod/endpoints.ts',
    'src/types/generated/zod/schemas.ts',
    'src/mcp/execute-tool-call.ts',
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
    '@oaknational/mcp-core',
    'zod',
  ],
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
  // Enable proper ESM import rewriting
  esbuildOptions(options) {
    // Force ESM imports to include .js extensions
    options.plugins = options.plugins ?? [];
    options.plugins.push({
      name: 'add-js-extension',
      setup(build) {
        build.onResolve({ filter: /^\./ }, (args) => {
          // Only add .js for relative imports that don't already have an extension
          if (!args.path.includes('.')) {
            return { path: args.path + '.js', external: true };
          }
          return { external: true };
        });
      },
    });
  },
});
