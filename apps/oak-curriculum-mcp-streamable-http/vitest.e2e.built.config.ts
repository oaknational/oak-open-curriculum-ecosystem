import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(rootDir, '../..');

/**
 * Vitest config specifically for built server E2E tests.
 *
 * This runs separately from the main E2E tests because:
 * - It requires a successful build (dist/src/index.js must exist)
 * - It spawns a separate Node.js process
 * - It tests the production artifact, not source code
 *
 * Run with: pnpm test:e2e:built
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [resolve(repoRoot, 'test.setup.env.ts')],
    include: ['e2e-tests/built-server.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
