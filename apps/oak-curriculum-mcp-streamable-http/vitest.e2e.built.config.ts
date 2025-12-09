import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Vitest config specifically for built server E2E tests.
 *
 * This runs separately from the main E2E tests because:
 * - It requires a successful build (dist/src/index.js must exist)
 * - It spawns a separate Node.js process
 * - It tests the production artifact, not source code
 *
 * @remarks This config does NOT use mergeConfig with baseE2EConfig because
 * mergeConfig merges include arrays rather than replacing them, which would
 * cause all e2e tests to run instead of just the built server test.
 *
 * Run with: pnpm test:e2e:built
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: [resolve(repoRoot, 'test.setup.env.ts')],
    passWithNoTests: true,
    include: ['e2e-tests/built-server.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    testTimeout: 30000,
    hookTimeout: 30000,
    retry: 0,
    isolate: true,
    pool: 'forks',
  },
});
