import type { PrepareEnvironmentOptions, PreparedEnvironment, LoadedEnvResult } from '../types.js';
import { startSmokeServer } from '../local-server.js';

export const STUB_DEV_TOKEN = 'stub-smoke-dev-token';
export const STUB_API_KEY = 'stub-smoke-key';

export async function prepareLocalStubEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: LoadedEnvResult,
): Promise<PreparedEnvironment> {
  delete process.env.OAK_API_KEY;
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.PORT = String(options.port);
  process.env.REMOTE_MCP_DEV_TOKEN = STUB_DEV_TOKEN;
  process.env.OAK_API_KEY = STUB_API_KEY;
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
  process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true'; // Enable auth bypass for stub testing
  return {
    baseUrl: `http://localhost:${String(options.port)}`,
    devToken: STUB_DEV_TOKEN,
    envLoad,
    server: await startSmokeServer(options.port),
    devTokenSource: 'stub-default',
  };
}
