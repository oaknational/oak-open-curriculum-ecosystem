import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  minify: false,
  bundle: true, // Bundle to avoid ESM directory import issues
  platform: 'neutral', // Use 'neutral' for edge compatibility
  // Force bundling of all dependencies except workspace packages and Node built-ins
  noExternal: ['@notionhq/client', '@modelcontextprotocol/sdk', 'zod', 'consola'],
  external: [
    // Node built-ins - keep external for edge compatibility
    'node:*',
    'fs',
    'fs/promises',
    'path',
    'url',
    'stream',
    'util',
    'crypto',
    'os',
    'process',
    'child_process',
    'http',
    'https',
    'net',
    'tls',
    'dns',
    'events',
    'buffer',
    // Workspace packages (these are already built)
    '@oaknational/mcp-logger',
    '@oaknational/mcp-storage',
    '@oaknational/mcp-env',
  ],
  // Mark the package as having no side effects for better tree-shaking
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  // Exclude test files from build
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
