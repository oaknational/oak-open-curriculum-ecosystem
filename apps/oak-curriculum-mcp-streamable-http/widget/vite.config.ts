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
import { exec } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const widgetRoot = resolve(import.meta.dirname);
const packageJsonPath = resolve(widgetRoot, '..', 'package.json');
const packageVersion = JSON.parse(readFileSync(packageJsonPath, 'utf-8')).version;

/**
 * Derives the monorepo workspace root by walking up from `startDir` to
 * find `pnpm-workspace.yaml`. Returns `undefined` if not found
 * (standalone checkout or misconfigured clone).
 */
function findWorkspaceRoot(startDir: string): string | undefined {
  let current = startDir;
  const root = resolve('/');

  while (current !== root) {
    if (existsSync(resolve(current, 'pnpm-workspace.yaml'))) {
      return current;
    }
    current = resolve(current, '..');
  }

  return undefined;
}

const workspaceRoot = findWorkspaceRoot(widgetRoot);
const tokenSourceDir = workspaceRoot
  ? resolve(workspaceRoot, 'packages/design/oak-design-tokens/src')
  : undefined;

export default defineConfig({
  root: widgetRoot,
  plugins: [
    react(),
    viteSingleFile(),
    /**
     * Cross-workspace file watcher for design token source files.
     *
     * Watches `oak-design-tokens/src/` and triggers an async rebuild
     * + full-reload when token JSON or TS sources change. Guarded by
     * an existence check on the token source directory and a rebuild
     * lock to prevent concurrent builds.
     *
     * Remove when Turborepo watch mode supports cross-workspace dev
     * dependency tracking (tracked in vercel/turbo roadmap).
     */
    {
      name: 'oak-design-tokens-watch',
      apply: 'serve',
      configureServer(server) {
        if (!workspaceRoot) {
          server.config.logger.warn(
            'Could not find pnpm-workspace.yaml — skipping design token watcher',
          );
          return;
        }

        if (!tokenSourceDir || !existsSync(tokenSourceDir)) {
          server.config.logger.warn(
            `Token source directory not found at ${tokenSourceDir ?? '(unknown)'} — skipping design token watcher`,
          );
          return;
        }

        let rebuilding = false;
        const tokenSourcePrefix = tokenSourceDir + sep;

        server.watcher.add(resolve(tokenSourceDir, 'tokens'));

        server.watcher.on('change', (changedPath) => {
          if (changedPath !== tokenSourceDir && !changedPath.startsWith(tokenSourcePrefix)) {
            return;
          }

          if (rebuilding) {
            server.config.logger.info('Token rebuild already in progress — skipping', {
              timestamp: true,
            });
            return;
          }

          server.config.logger.info(`Token source changed: ${changedPath}`, {
            timestamp: true,
          });

          rebuilding = true;

          exec(
            'OAK_TOKEN_DEV=1 pnpm --filter @oaknational/oak-design-tokens build',
            { cwd: workspaceRoot },
            (error, stdout, stderr) => {
              try {
                if (error) {
                  const output = stderr || stdout || error.message;
                  server.config.logger.error(`Token build failed:\n${output}`);
                  return;
                }

                server.config.logger.info('Design tokens rebuilt — sending full reload', {
                  timestamp: true,
                });

                server.ws.send({ type: 'full-reload' });
              } finally {
                rebuilding = false;
              }
            },
          );
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
