import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // ESM only as requested
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, // Keep readable for development
  target: 'es2022', // Match our tsconfig target
  platform: 'node',
  tsconfig: './tsconfig.json',
  shims: false, // No CJS shims needed for ESM-only
  // Bundle all dependencies for standalone execution
  // Only mark Node.js built-ins as external
  noExternal: [/@modelcontextprotocol\/sdk/, /@notionhq\/client/, /dotenv/, /zod/],
});
