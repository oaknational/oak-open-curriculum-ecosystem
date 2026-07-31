import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Base Vitest configuration for E2E tests.
 *
 * E2E tests verify running system behaviour. They may trigger file system
 * and STDIO IO. Suites that run a local HTTP harness bind it to
 * `127.0.0.1` explicitly — in the MCP app via its loopback request
 * helper (MCP-403: a host-less listen binds `::` and can silently share
 * a port with a foreign v4 listener in the ephemeral range); suites
 * without a local server open no sockets at all. Fetch-based network calls
 * are blocked (`test.setup.no-network.ts`); suites extending this base
 * for live-service validation (smoke / experiments) restore the real
 * fetch from `__ORIGINAL_FETCH__` in their own later-running setup and
 * are network-real by design — which is exactly the contract the
 * sentinel's check-then-patch guard protects. In-process E2E tests must
 * use DI via `loadRuntimeConfig(isolatedEnv)` — see ADR-078.
 */
export const baseE2EConfig = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Fetch is blocked; use DI and local fakes instead of real services.
    setupFiles: [resolve(dirname(fileURLToPath(import.meta.url)), 'test.setup.no-network.ts')],
    include: ['e2e-tests/**/*.e2e.test.ts', 'e2e/**/*.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    testTimeout: 60000, // E2E tests may take longer; 60s provides headroom under resource pressure
    hookTimeout: 30000,
    retry: 0, // No retries by default for E2E
  },
});

export default baseE2EConfig;
