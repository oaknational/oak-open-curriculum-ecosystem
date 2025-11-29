import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

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
export default mergeConfig(baseE2EConfig, {
  test: {
    include: ['e2e-tests/built-server.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
});
