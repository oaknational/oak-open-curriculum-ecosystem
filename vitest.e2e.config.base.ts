import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Base Vitest configuration for E2E tests.
 *
 * E2E tests verify running system behaviour. They may trigger file system
 * and STDIO IO but NOT network IO. In-process E2E tests must use DI via
 * `loadRuntimeConfig(isolatedEnv)` — see ADR-078.
 */
export const baseE2EConfig = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Ensure repo-root .env loading happens before any tests run
    setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), 'test.setup.env.ts')],
    passWithNoTests: true,
    include: ['e2e-tests/**/*.e2e.test.ts', 'e2e/**/*.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    testTimeout: 60000, // E2E tests may take longer; 60s provides headroom under resource pressure
    hookTimeout: 30000,
    retry: 0, // No retries by default for E2E
  },
});

export default baseE2EConfig;
