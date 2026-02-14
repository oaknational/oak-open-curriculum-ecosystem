import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { getServerPort, startSmokeServer } from '../local-server.js';

export async function prepareLocalLiveEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): Promise<PreparedEnvironment> {
  delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  process.env.PORT = String(options.port);
  const apiKey = process.env.OAK_API_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    const sourceHint =
      envLoad.loaded && envLoad.path
        ? `loadRootEnv loaded ${envLoad.path}`
        : 'loadRootEnv did not load a .env file';
    throw new Error(
      `OAK_API_KEY is required for live smoke tests. ${sourceHint}. Repository root: ${envLoad.repoRoot}`,
    );
  }
  // Disable auth – live mode here checks Oak API plumbing only.
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
