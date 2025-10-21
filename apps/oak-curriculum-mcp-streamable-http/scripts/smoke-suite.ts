import type { Server } from 'node:http';

import { createApp } from '../src/index.js';
import { loadRootEnv } from '@oaknational/mcp-env';

import { runSmokeAssertions, type SmokeContext } from './smoke-assertions/index.js';

const DEFAULT_PORT = 3333;

type LocalSmokeMode = 'local-stub' | 'local-live';

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

export async function runSmokeSuite(options: SmokeSuiteOptions): Promise<void> {
  const snapshot = captureEnvSnapshot();
  const devToken = options.remoteDevToken ?? snapshot.REMOTE_MCP_DEV_TOKEN ?? 'dev-token';
  process.env.REMOTE_MCP_DEV_TOKEN = devToken;

  const mode = options.mode;
  const port = options.port ?? DEFAULT_PORT;

  let server: Server | undefined;
  try {
    const baseUrl =
      mode === 'remote'
        ? prepareRemoteEnvironment(options.remoteBaseUrl)
        : await prepareLocalEnvironment(mode, port);

    await runSmokeAssertions({ baseUrl, devToken } satisfies SmokeContext);
    console.log('Smoke OK for', baseUrl);
  } finally {
    if (server) {
      await closeServer(server);
    }
    restoreEnv(snapshot);
  }

  async function prepareLocalEnvironment(
    localMode: LocalSmokeMode,
    portNumber: number,
  ): Promise<string> {
    process.env.PORT = String(portNumber);
    if (localMode === 'local-stub') {
      enforceStubMode();
    } else {
      enforceLiveMode();
    }

    server = await startServer(portNumber);
    return `http://localhost:${String(portNumber)}`;
  }

  function prepareRemoteEnvironment(remoteBaseUrl?: string): string {
    if (!remoteBaseUrl) {
      throw new Error(
        'Remote smoke tests require a base URL. Pass it as the first CLI argument or set SMOKE_REMOTE_BASE_URL.',
      );
    }
    clearStubOverrides();
    return normaliseBaseUrl(remoteBaseUrl);
  }
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

function enforceStubMode(): void {
  process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS = 'true';
  process.env.OAK_API_KEY ??= 'stub-smoke-key';
}

function enforceLiveMode(): void {
  delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
  loadRootEnv({ requiredKeys: ['OAK_API_KEY'], startDir: process.cwd(), env: process.env });
  if (!process.env.OAK_API_KEY) {
    throw new Error('OAK_API_KEY is required for live smoke tests');
  }
}

function clearStubOverrides(): void {
  delete process.env.OAK_CURRICULUM_MCP_USE_STUB_TOOLS;
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
