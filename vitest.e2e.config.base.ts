import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Base Vitest configuration for E2E tests
 * Only oak-notion-mcp (the application phenotype) should have E2E tests
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
    testTimeout: 30000, // E2E tests may take longer
    hookTimeout: 30000,
    bail: 1, // Stop on first failure in E2E tests
    retry: 0, // No retries by default for E2E
  },
});

export default baseE2EConfig;
