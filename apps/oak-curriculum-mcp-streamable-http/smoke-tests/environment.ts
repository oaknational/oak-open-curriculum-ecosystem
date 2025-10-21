import type { Server } from 'node:http';

import { loadRootEnv } from '@oaknational/mcp-env';
import type { Logger } from '@oaknational/mcp-logger';
import type { EnvSnapshot, PrepareEnvironmentOptions, PreparedEnvironment } from './types.js';
import type { SmokeSuiteMode } from './smoke-assertions/types.js';

export const DEFAULT_PORT = 3333;
export const STUB_DEV_TOKEN = 'stub-smoke-dev-token';
export const STUB_API_KEY = 'stub-smoke-key';

export async function prepareEnvironment(
  options: PrepareEnvironmentOptions,
): Promise<PreparedEnvironment> {
  if (options.mode === 'local-stub') {
    const envLoad = loadRootEnv({
      startDir: process.cwd(),
      env: process.env,
      envFileOrder: [],
    });
    return prepareStubEnvironment(options, envLoad);
  }

  const requiredKeys = options.mode === 'local-live' ? ['OAK_API_KEY'] : [];
  const envLoad = loadRootEnv({
    startDir: process.cwd(),
    env: process.env,
    requiredKeys,
  });
  if (options.mode === 'local-live') {
    return prepareLiveEnvironment(options, envLoad);
  }

  return prepareRemoteEnvironment(options, envLoad);
}

export async function teardownEnvironment(
  prepared: PreparedEnvironment | undefined,
  logger: Logger,
  mode: SmokeSuiteMode,
): Promise<void> {
  if (!prepared?.server) {
    return;
  }
  await closeServer(prepared.server);
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

async function prepareStubEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: ReturnType<typeof loadRootEnv>,
): Promise<PreparedEnvironment> {
  delete process.env.OAK_API_KEY;
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.PORT = String(options.port);
  process.env.REMOTE_MCP_DEV_TOKEN = STUB_DEV_TOKEN;
  process.env.OAK_API_KEY = STUB_API_KEY;
  return {
    baseUrl: `http://localhost:${String(options.port)}`,
    devToken: STUB_DEV_TOKEN,
    envLoad,
    server: await startServer(options.port),
    devTokenSource: 'stub-default',
  };
}

async function prepareLiveEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: ReturnType<typeof loadRootEnv>,
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
  return {
    baseUrl: `http://localhost:${String(options.port)}`,
    devToken: devTokenResult.value ?? 'dev-token',
    envLoad,
    server: await startServer(options.port),
    devTokenSource: devTokenResult.source,
  };
}

function prepareRemoteEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: ReturnType<typeof loadRootEnv>,
): PreparedEnvironment {
  delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  Reflect.deleteProperty(process.env, 'PORT');

  const remoteSelection = resolveRemoteBaseUrl(
    options.remoteBaseUrl,
    process.env.SMOKE_REMOTE_BASE_URL,
    process.env.OAK_MCP_URL,
  );
  if (!remoteSelection) {
    throw new Error(
      `Remote smoke tests require a base URL. Provide a CLI argument, set SMOKE_REMOTE_BASE_URL, or define OAK_MCP_URL in process env or the repo .env (root: ${envLoad.repoRoot}).`,
    );
  }
  const devTokenResult = resolveDevToken(
    options.remoteDevToken,
    process.env.REMOTE_MCP_DEV_TOKEN,
    {},
  );
  if (!devTokenResult.value) {
    throw new TypeError('options.remoteDevToken or process.env.REMOTE_MCP_DEV_TOKEN is required');
  }
  process.env.REMOTE_MCP_DEV_TOKEN = devTokenResult.value;
  return {
    baseUrl: remoteSelection.baseUrl,
    devToken: devTokenResult.value,
    envLoad,
    remoteUrlSource: remoteSelection.source,
    devTokenSource: devTokenResult.source,
  };
}

function resolveRemoteBaseUrl(
  cliCandidate?: string,
  envCandidate?: string,
  oakCandidate?: string,
):
  | { readonly baseUrl: string; readonly source: 'cli' | 'smokeRemoteBaseUrl' | 'oakMcpUrl' }
  | undefined {
  const candidates: ['cli' | 'smokeRemoteBaseUrl' | 'oakMcpUrl', string | undefined][] = [
    ['cli', cliCandidate?.trim()],
    ['smokeRemoteBaseUrl', envCandidate?.trim()],
    ['oakMcpUrl', oakCandidate?.trim()],
  ];

  for (const [source, value] of candidates) {
    if (value && value.length > 0) {
      return { baseUrl: normaliseBaseUrl(value), source };
    }
  }
  return undefined;
}

function normaliseBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim();
  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  const formatted = new URL(withProtocol).toString();
  return formatted.endsWith('/') ? formatted.slice(0, -1) : formatted;
}

function resolveDevToken(
  explicitValue: string | undefined,
  envValue: string | undefined,
  options: { readonly fallbackValue?: string },
): { readonly value: string | undefined; readonly source: 'cli' | 'env' | 'fallback' } {
  const candidate = explicitValue?.trim();
  if (candidate) {
    return { value: candidate, source: 'cli' };
  }

  const envCandidate = envValue?.trim();
  if (envCandidate) {
    return { value: envCandidate, source: 'env' };
  }

  if (options.fallbackValue !== undefined) {
    return { value: options.fallbackValue, source: 'fallback' };
  }

  return { value: undefined, source: 'fallback' };
}

async function startServer(port: number): Promise<Server> {
  const { createApp } = await import('../src/index.js');
  const app = createApp();
  return await new Promise<Server>((resolve, reject) => {
    const instance = app.listen(port, () => {
      resolve(instance);
    });
    instance.on('error', reject);
  });
}

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}
