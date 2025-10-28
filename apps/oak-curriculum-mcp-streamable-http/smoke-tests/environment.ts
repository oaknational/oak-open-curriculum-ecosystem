import { loadRootEnv } from '@oaknational/mcp-env';
import type { Logger } from '@oaknational/mcp-logger';
import type {
  EnvSnapshot,
  PrepareEnvironmentOptions,
  PreparedEnvironment,
  LoadedEnvResult,
} from './types.js';
import type { SmokeSuiteMode } from './smoke-assertions/types.js';
import { closeSmokeServer } from './local-server.js';
import { prepareLocalStubEnvironment, STUB_API_KEY, STUB_DEV_TOKEN } from './modes/local-stub.js';
import { prepareLocalLiveEnvironment } from './modes/local-live.js';
import { prepareRemoteEnvironment as prepareRemoteModeEnvironment } from './modes/remote.js';

export const DEFAULT_PORT = 3333;
export { STUB_DEV_TOKEN, STUB_API_KEY };

export async function prepareEnvironment(
  options: PrepareEnvironmentOptions,
): Promise<PreparedEnvironment> {
  if (options.mode === 'local-stub') {
    const envLoad = loadEnvironment({ envFileOrder: [] });
    return prepareLocalStubEnvironment(options, envLoad);
  }

  const requiredKeys = options.mode === 'local-live' ? ['OAK_API_KEY'] : [];
  const envLoad = loadEnvironment({ requiredKeys });
  if (options.mode === 'local-live') {
    return prepareLocalLiveEnvironment(options, envLoad);
  }

  return prepareRemoteModeEnvironment(options, envLoad);
}

export async function teardownEnvironment(
  prepared: PreparedEnvironment | undefined,
  logger: Logger,
  mode: SmokeSuiteMode,
): Promise<void> {
  if (!prepared?.server) {
    return;
  }
  await closeSmokeServer(prepared.server);
  logger.debug('Closed local smoke server', { baseUrl: prepared.baseUrl, mode });
}

export function captureEnvSnapshot(): EnvSnapshot {
  return {
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS,
    OAK_API_KEY: process.env.OAK_API_KEY,
    REMOTE_MCP_DEV_TOKEN: process.env.REMOTE_MCP_DEV_TOKEN,
    PORT: process.env.PORT,
  };
}

export function restoreEnv(snapshot: EnvSnapshot): void {
  (
    ['OAK_CURRICULUM_MCP_USE_STUB_TOOLS', 'OAK_API_KEY', 'REMOTE_MCP_DEV_TOKEN', 'PORT'] as const
  ).forEach((key) => {
    restoreKey(key, snapshot[key]);
  });
}

function restoreKey(key: keyof EnvSnapshot, value: string | undefined): void {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, key);
  } else {
    process.env[key] = value;
  }
}

function loadEnvironment(options: {
  readonly envFileOrder?: string[];
  readonly requiredKeys?: string[];
}): LoadedEnvResult {
  return loadRootEnv({
    startDir: process.cwd(),
    env: process.env,
    envFileOrder: options.envFileOrder,
    requiredKeys: options.requiredKeys,
  });
}
