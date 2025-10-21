import type { Server } from 'node:http';

import { createApp } from '../src/index.js';
import { loadRootEnv } from '@oaknational/mcp-env';

import { runSmokeAssertions, type SmokeContext } from './smoke-assertions/index.js';

const DEFAULT_PORT = 3333;
const STUB_DEV_TOKEN = 'stub-smoke-dev-token';
const STUB_API_KEY = 'stub-smoke-key';

type LocalSmokeMode = 'local-stub' | 'local-live';
type RemoteUrlSource = 'cli' | 'smokeRemoteBaseUrl' | 'oakMcpUrl';

interface SmokeSuiteOptions {
  readonly mode: LocalSmokeMode | 'remote';
  readonly port?: number;
  readonly remoteBaseUrl?: string;
  readonly remoteDevToken?: string;
}

interface EnvSnapshot {
  readonly OAK_CURRICULUM_MCP_USE_STUB_TOOLS?: string;
  readonly OAK_API_KEY?: string;
  readonly REMOTE_MCP_DEV_TOKEN?: string;
  readonly PORT?: string;
}

interface PreparedEnvironment {
  readonly baseUrl: string;
  readonly devToken: string;
  readonly envLoad: ReturnType<typeof loadRootEnv>;
  readonly server?: Server;
  readonly remoteUrlSource?: RemoteUrlSource;
}
interface PrepareEnvironmentOptions {
  readonly mode: SmokeSuiteOptions['mode'];
  readonly port: number;
  readonly remoteBaseUrl?: string;
  readonly remoteDevToken?: string;
}

export async function runSmokeSuite(options: SmokeSuiteOptions): Promise<void> {
  const snapshot = captureEnvSnapshot();
  const port = options.port ?? DEFAULT_PORT;

  let prepared: PreparedEnvironment | undefined;
  try {
    prepared = await prepareEnvironment({
      mode: options.mode,
      port,
      remoteBaseUrl: options.remoteBaseUrl,
      remoteDevToken: options.remoteDevToken,
    });

    logPreparation(options.mode, prepared);
    await runSmokeAssertions({
      baseUrl: prepared.baseUrl,
      devToken: prepared.devToken,
    } satisfies SmokeContext);
    console.log(`Smoke OK for ${options.mode} (${prepared.baseUrl})`);
  } finally {
    if (prepared?.server) {
      await closeServer(prepared.server);
    }
    restoreEnv(snapshot);
  }
}

async function prepareEnvironment(
  options: PrepareEnvironmentOptions,
): Promise<PreparedEnvironment> {
  const requiredKeys = options.mode === 'local-live' ? ['OAK_API_KEY'] : [];
  const envLoad = loadRootEnv({
    startDir: process.cwd(),
    env: process.env,
    requiredKeys,
  });
  if (options.mode === 'local-stub') {
    return await prepareStubEnvironment(options, envLoad);
  }

  if (options.mode === 'local-live') {
    return await prepareLiveEnvironment(options, envLoad);
  }

  return prepareRemoteEnvironment(options, envLoad);
}
async function prepareStubEnvironment(
  options: PrepareEnvironmentOptions,
  envLoad: ReturnType<typeof loadRootEnv>,
): Promise<PreparedEnvironment> {
  process.env.OAK_API_KEY = STUB_API_KEY;
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.PORT = String(options.port);
  const devToken = STUB_DEV_TOKEN;
  process.env.REMOTE_MCP_DEV_TOKEN = devToken;
  const server = await startServer(options.port);
  return {
    baseUrl: `http://localhost:${String(options.port)}`,
    devToken,
    envLoad,
    server,
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
  const devToken = options.remoteDevToken ?? process.env.REMOTE_MCP_DEV_TOKEN ?? 'dev-token';
  process.env.REMOTE_MCP_DEV_TOKEN = devToken;
  const server = await startServer(options.port);
  return {
    baseUrl: `http://localhost:${String(options.port)}`,
    devToken,
    envLoad,
    server,
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
    const repoHint = envLoad.repoRoot;
    throw new Error(
      `Remote smoke tests require a base URL. Provide a CLI argument, set SMOKE_REMOTE_BASE_URL, or define OAK_MCP_URL in process env or the repo .env (root: ${repoHint}).`,
    );
  }
  const devToken = options.remoteDevToken ?? process.env.REMOTE_MCP_DEV_TOKEN ?? 'dev-token';
  process.env.REMOTE_MCP_DEV_TOKEN = devToken;

  return {
    baseUrl: remoteSelection.baseUrl,
    devToken,
    envLoad,
    remoteUrlSource: remoteSelection.source,
  };
}

function logPreparation(mode: SmokeSuiteOptions['mode'], preparation: PreparedEnvironment): void {
  const envMessage =
    preparation.envLoad.loaded && preparation.envLoad.path
      ? `loadRootEnv loaded ${preparation.envLoad.path}`
      : 'loadRootEnv did not load a .env file';
  console.log(`[smoke] Mode ${mode}: ${envMessage} (repo ${preparation.envLoad.repoRoot})`);

  if (mode === 'remote') {
    const source = preparation.remoteUrlSource ?? 'unspecified';
    console.log(`[smoke] Remote base URL [${source}]: ${preparation.baseUrl}`);
  } else {
    console.log(`[smoke] Local base URL: ${preparation.baseUrl}`);
  }
  console.log(`[smoke] Using dev token: ${preparation.devToken}`);
}

function resolveRemoteBaseUrl(
  cliCandidate?: string,
  envCandidate?: string,
  oakCandidate?: string,
): { readonly baseUrl: string; readonly source: RemoteUrlSource } | undefined {
  const candidates: [RemoteUrlSource, string | undefined][] = [
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

function captureEnvSnapshot(): EnvSnapshot {
  return {
    OAK_CURRICULUM_MCP_USE_STUB_TOOLS: process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS,
    OAK_API_KEY: process.env.OAK_API_KEY,
    REMOTE_MCP_DEV_TOKEN: process.env.REMOTE_MCP_DEV_TOKEN,
    PORT: process.env.PORT,
  };
}

function restoreEnv(snapshot: EnvSnapshot): void {
  restoreKey('OAK_CURRICULUM_MCP_USE_STUB_TOOLS', snapshot.OAK_CURRICULUM_MCP_USE_STUB_TOOLS);
  restoreKey('OAK_API_KEY', snapshot.OAK_API_KEY);
  restoreKey('REMOTE_MCP_DEV_TOKEN', snapshot.REMOTE_MCP_DEV_TOKEN);
  restoreKey('PORT', snapshot.PORT);
}

function restoreKey(key: keyof EnvSnapshot, value: string | undefined): void {
  if (value === undefined) {
    Reflect.deleteProperty(process.env, key);
  } else {
    process.env[key] = value;
  }
}

function normaliseBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim();
  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  const formatted = new URL(withProtocol).toString();
  return formatted.endsWith('/') ? formatted.slice(0, -1) : formatted;
}

async function startServer(port: number): Promise<Server> {
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
