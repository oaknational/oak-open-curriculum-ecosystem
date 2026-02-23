import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import { findRepoRoot } from '@oaknational/mcp-env';
import type { Logger } from '@oaknational/mcp-logger';
import type {
  EnvSnapshot,
  PrepareEnvironmentOptions,
  PreparedEnvironment,
  LoadedEnvResult,
} from './types.js';
import type { SmokeSuiteMode } from './smoke-assertions/types.js';
import { closeSmokeServer } from './local-server.js';
import { prepareLocalStubEnvironment, STUB_API_KEY } from './modes/local-stub.js';
import { prepareLocalLiveEnvironment } from './modes/local-live.js';
import { prepareLocalLiveAuthEnvironment } from './modes/local-live-auth.js';
import { prepareLocalStubAuthEnvironment } from './modes/local-stub-auth.js';
import { prepareRemoteEnvironment as prepareRemoteModeEnvironment } from './modes/remote.js';

export const DEFAULT_PORT = 3333;
export { STUB_API_KEY };

export async function prepareEnvironment(
  options: PrepareEnvironmentOptions,
): Promise<PreparedEnvironment> {
  if (options.mode === 'local-stub') {
    const envLoad = loadEnvironment({ skipFiles: true });
    return prepareLocalStubEnvironment(options, envLoad);
  }

  if (options.mode === 'local-stub-auth') {
    const envLoad = loadEnvironment({ skipFiles: true });
    return prepareLocalStubAuthEnvironment(options, envLoad);
  }

  const envLoad = loadEnvironment({ skipFiles: false });

  if (options.mode === 'local-live') {
    return prepareLocalLiveEnvironment(options, envLoad);
  }

  if (options.mode === 'local-live-auth') {
    return prepareLocalLiveAuthEnvironment(options, envLoad);
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
    PORT: process.env.PORT,
  };
}

export function restoreEnv(snapshot: EnvSnapshot): void {
  (['OAK_CURRICULUM_MCP_USE_STUB_TOOLS', 'OAK_API_KEY', 'PORT'] as const).forEach((key) => {
    restoreKey(key, snapshot[key]);
  });
}

/**
 * Architectural debt: smoke tests mutate global `process.env` because the
 * local server reads config from `process.env` at startup. The proper fix
 * is to build a per-mode env object and pass it via
 * `loadRuntimeConfig({ processEnv: modeEnv })`, eliminating all mutation.
 * See ADR-078 (DI for testability).
 */
function restoreKey(key: keyof EnvSnapshot, value: string | undefined): void {
  if (value === undefined) {
    // eslint-disable-next-line no-restricted-properties -- Architectural debt: smoke tests mutate process.env (see TSDoc above)
    Reflect.deleteProperty(process.env, key);
  } else {
    process.env[key] = value;
  }
}

/**
 * Loads `.env` files from the monorepo root into `process.env`.
 *
 * Uses `dotenv.config()` to load `.env.local` then `.env` (both are loaded,
 * `.env.local` takes precedence via dotenv's default no-override behaviour).
 */
function loadEnvironment(options: { readonly skipFiles: boolean }): LoadedEnvResult {
  const repoRoot = findRepoRoot(process.cwd());
  if (repoRoot === undefined) {
    throw new Error('Smoke tests must run inside the monorepo');
  }

  if (options.skipFiles) {
    return { loaded: false, repoRoot };
  }

  const localPath = join(repoRoot, '.env.local');
  const basePath = join(repoRoot, '.env');

  let loaded = false;
  let loadedPath: string | undefined;

  if (existsSync(localPath)) {
    dotenvConfig({ path: localPath });
    loaded = true;
    loadedPath = localPath;
  }

  if (existsSync(basePath)) {
    dotenvConfig({ path: basePath });
    if (!loaded) {
      loaded = true;
      loadedPath = basePath;
    }
  }

  return { loaded, path: loadedPath, repoRoot };
}
