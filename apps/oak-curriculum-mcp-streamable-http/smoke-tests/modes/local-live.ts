import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { resolveDevToken } from '../token-resolution.js';
import { startSmokeServer } from '../local-server.js';

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
  const devTokenResult = resolveDevToken(options.remoteDevToken, process.env.REMOTE_MCP_DEV_TOKEN, {
    fallbackValue: 'dev-token',
  });
  process.env.REMOTE_MCP_DEV_TOKEN = devTokenResult.value ?? 'dev-token';
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
  process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true'; // Enable auth bypass for local testing
  return {
    baseUrl: `http://localhost:${String(options.port)}`,
    devToken: devTokenResult.value ?? 'dev-token',
    envLoad,
    server: await startSmokeServer(options.port),
    devTokenSource: devTokenResult.source,
  };
}
