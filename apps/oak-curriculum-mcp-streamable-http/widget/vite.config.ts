/**
 * Vite configuration for the Oak MCP App widget.
 *
 * Builds a self-contained `index.html` file that can be served as an
 * MCP App resource. Uses `vite-plugin-singlefile` to inline all JS and CSS
 * into one HTML file — no external network requests needed from the iframe.
 *
 * In dev mode, a custom plugin watches the design token source directory
 * (`packages/design/oak-design-tokens/src/`) and rebuilds the token CSS
 * when any JSON or TS source changes. This enables live-reload of token
 * edits across the workspace boundary without a manual rebuild step.
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const widgetRoot = resolve(import.meta.dirname);
const packageJsonPath = resolve(widgetRoot, '..', 'package.json');
const packageVersion = JSON.parse(readFileSync(packageJsonPath, 'utf-8')).version;

const tokenSourceDir = resolve(widgetRoot, '../../../packages/design/oak-design-tokens/src');

export default defineConfig({
  root: widgetRoot,
  plugins: [
    react(),
    viteSingleFile(),
    {
      name: 'oak-design-tokens-watch',
      apply: 'serve',
      configureServer(server) {
        server.watcher.add(resolve(tokenSourceDir, 'tokens'));

        server.watcher.on('change', (changedPath) => {
          if (!changedPath.startsWith(tokenSourceDir)) {
            return;
          }

          server.config.logger.info(`Token source changed: ${changedPath}`, {
            timestamp: true,
          });

          try {
            execSync('OAK_TOKEN_DEV=1 pnpm --filter @oaknational/oak-design-tokens build', {
              cwd: resolve(widgetRoot, '../../..'),
              stdio: 'pipe',
            });

            server.config.logger.info('Design tokens rebuilt — sending full reload', {
              timestamp: true,
            });

            server.ws.send({ type: 'full-reload' });
          } catch (buildError: unknown) {
            const message = buildError instanceof Error ? buildError.message : String(buildError);

            server.config.logger.error(`Token build failed:\n${message}`);
          }
        });
      },
    },
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageVersion),
  },
  build: {
    outDir: resolve(widgetRoot, '..', 'dist'),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(widgetRoot, 'index.html'),
    },
  },
});
