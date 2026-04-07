/**
 * Vite configuration for the Oak MCP App widget.
 *
 * **Dev mode** (multi-page): Serves an index page, individual widget pages,
 * and a design token demo page. The dev server watches design token sources
 * and rebuilds token CSS on change for live-reload across workspaces.
 *
 * **Build mode** (single-page): Builds only `oak-banner.html` as a
 * self-contained HTML file via `vite-plugin-singlefile`. The output
 * (`dist/oak-banner.html`) is registered as the MCP App resource.
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
    /**
     * Cross-workspace file watcher for design token source files.
     *
     * Watches `oak-design-tokens/src/` and triggers a synchronous rebuild
     * + full-reload when token JSON or TS sources change. This is fragile:
     * it uses `execSync` (blocks the event loop), and knows the internal
     * source layout of a different workspace. If `oak-design-tokens`
     * restructures its `src/tokens/` directory, this watcher silently
     * breaks with no build error.
     *
     * Remove when Turborepo watch mode supports cross-workspace dev
     * dependency tracking (tracked in vercel/turbo roadmap).
     */
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
      input: resolve(widgetRoot, 'oak-banner.html'),
    },
  },
});
