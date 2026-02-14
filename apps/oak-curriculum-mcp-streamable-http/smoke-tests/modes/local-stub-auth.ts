/**
 * Local Stub Auth Mode
 *
 * This mode tests auth enforcement with mocked authentication.
 * Note: Currently uses real Clerk middleware (see note below).
 *
 * For deterministic mock-based auth testing, see:
 * - src/test-fixtures/mock-clerk-middleware.integration.test.ts
 * - src/clerk-auth-middleware.integration.test.ts
 *
 * Smoke tests validate end-to-end behavior of a running system.
 * Mock-based unit/integration tests provide deterministic auth behavior testing.
 */

import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { getServerPort, startSmokeServer } from '../local-server.js';

export const STUB_API_KEY = 'stub-smoke-key';
const STUB_CLERK_PUBLISHABLE_KEY = 'REDACTED';
const STUB_CLERK_SECRET_KEY = 'sk_test_stub_for_smoke_testing';

/**
 * Prepares environment for local stub auth mode
 *
 * This mode enables auth enforcement but uses stub tools.
 * Auth is enforced using real Clerk middleware (requires valid Clerk keys).
 *
 * Note: For fully mocked auth testing without external dependencies,
 * use integration tests in src/test-fixtures/ instead.
 */
export async function prepareLocalStubAuthEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): Promise<PreparedEnvironment> {
  delete process.env.OAK_API_KEY;
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.PORT = String(options.port);
  process.env.OAK_API_KEY = STUB_API_KEY;
  process.env.CLERK_PUBLISHABLE_KEY = STUB_CLERK_PUBLISHABLE_KEY;
  process.env.CLERK_SECRET_KEY = STUB_CLERK_SECRET_KEY;
  // Auth is ENABLED - no DANGEROUSLY_DISABLE_AUTH
  delete process.env.DANGEROUSLY_DISABLE_AUTH;

  const server = await startSmokeServer(options.port);
  const port = getServerPort(server);

  return {
    baseUrl: `http://localhost:${String(port)}`,
    devToken: undefined, // No dev token - auth requires real OAuth token
    envLoad,
    server,
    devTokenSource: 'not-required', // Auth will be enforced via Clerk
  };
}
