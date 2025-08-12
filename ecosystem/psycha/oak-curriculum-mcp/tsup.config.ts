import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/organa/curriculum/operations/*.ts', 'src/organa/mcp/tools/*.ts'],
  format: ['esm'],
  dts: false, // Let TypeScript handle declarations
  splitting: true, // Enable code splitting for multi-entry
  sourcemap: true,
  clean: true,
  target: 'node22',
  minify: false,
  bundle: false, // Unbundled for better tree-shaking with multi-entry
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
    '@oaknational/mcp-moria',
    '@oaknational/mcp-histos-logger',
    '@oaknational/mcp-histos-storage',
    '@oaknational/mcp-histos-env',
    '@oaknational/mcp-histos-transport',
    '@oaknational/oak-curriculum-sdk',
  ],
  // Mark the package as having no side effects for better tree-shaking
  treeshake: true,
  tsconfig: './tsconfig.build.json',
  // Exclude test files from build
  ignoreWatch: ['**/*.test.ts', '**/*.spec.ts'],
  outDir: 'dist',
});
