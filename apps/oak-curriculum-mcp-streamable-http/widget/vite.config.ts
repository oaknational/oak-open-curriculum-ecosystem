/**
 * Vite configuration for the Oak MCP App widget.
 *
 * Builds a self-contained `mcp-app.html` file that can be served as an
 * MCP App resource. Uses `vite-plugin-singlefile` to inline all JS and CSS
 * into one HTML file — no external network requests needed from the iframe.
 */
/**
 * Vite configuration for the Oak MCP App widget.
 *
 * Builds a self-contained `mcp-app.html` file that can be served as an
 * MCP App resource. Uses `vite-plugin-singlefile` to inline all JS and CSS
 * into one HTML file — no external network requests needed from the iframe.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const widgetRoot = resolve(import.meta.dirname);
const packageJsonPath = resolve(widgetRoot, '..', 'package.json');
const packageVersion = JSON.parse(readFileSync(packageJsonPath, 'utf-8')).version;

export default defineConfig({
  root: widgetRoot,
  plugins: [react(), viteSingleFile()],
  define: {
    __APP_VERSION__: JSON.stringify(packageVersion),
  },
  build: {
    outDir: resolve(widgetRoot, '..', 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(widgetRoot, 'mcp-app.html'),
    },
  },
});
