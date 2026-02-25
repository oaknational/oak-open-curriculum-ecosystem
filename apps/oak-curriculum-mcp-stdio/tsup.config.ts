import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    // Library entry — exports createServer
    'src/index': 'src/index.ts',
    // CLI binary entry
    'bin/oak-curriculum-mcp': 'bin/oak-curriculum-mcp.ts',
  },
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: true, // Shared chunks between entries to avoid duplication
  sourcemap: true,
  clean: true,
  target: 'es2022',
  minify: false,
  bundle: true, // Bundle from entry points — tsup follows the import graph
  platform: 'neutral', // Use 'neutral' for edge compatibility
  // Force bundling of all dependencies except workspace packages and Node built-ins
  noExternal: ['@modelcontextprotocol/sdk', 'zod', 'consola'],
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
    '@oaknational/logger',
    '@oaknational/env',
    '@oaknational/curriculum-sdk',
  ],
  // Mark the package as having no side effects for better tree-shaking
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  // Exclude test files from build
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
