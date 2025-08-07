import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    adaptive: 'src/adaptive.ts',
    'consola-logger': 'src/consola-logger.ts',
    node: 'src/node.ts',
    edge: 'src/edge.ts',
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  shims: false,
  external: ['@oaknational/mcp-moria', 'consola'],
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
    };
  },
});
