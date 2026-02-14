import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { getServerPort, startSmokeServer } from '../local-server.js';

export const STUB_API_KEY = 'stub-smoke-key';
const STUB_CLERK_PUBLISHABLE_KEY = 'stub-clerk-publishable-key';
const STUB_CLERK_SECRET_KEY = 'stub-clerk-secret-key';

export async function prepareLocalStubEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): Promise<PreparedEnvironment> {
  delete process.env.OAK_API_KEY;
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.PORT = String(options.port);
  process.env.OAK_API_KEY = STUB_API_KEY;
  process.env.CLERK_PUBLISHABLE_KEY ??= STUB_CLERK_PUBLISHABLE_KEY;
  process.env.CLERK_SECRET_KEY ??= STUB_CLERK_SECRET_KEY;
  // Disable auth – stub mode validates protocol behaviour with canned data.
  // Auth enforcement is exercised in auth-enforcement.e2e.test.ts and smoke-dev-auth.
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';

  const server = await startSmokeServer(options.port);
  const port = getServerPort(server);

  return {
    baseUrl: `http://localhost:${String(port)}`,
    devToken: undefined, // No dev token - auth is disabled
    envLoad,
    server,
    devTokenSource: 'not-applicable-auth-disabled',
  };
}
