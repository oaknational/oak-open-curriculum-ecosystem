import type { Server } from 'node:http';
import type { loadRootEnv } from '@oaknational/mcp-env';
import type { SmokeSuiteMode, DevTokenSource, RemoteUrlSource } from './smoke-assertions/types.js';

export interface SmokeSuiteOptions {
  readonly mode: SmokeSuiteMode;
  readonly port?: number;
  readonly remoteBaseUrl?: string;
  readonly remoteDevToken?: string;
}

export interface PrepareEnvironmentOptions {
  readonly mode: SmokeSuiteMode;
  readonly port: number;
  readonly remoteBaseUrl?: string;
  readonly remoteDevToken?: string;
}

export interface PreparedEnvironment {
  readonly baseUrl: string;
  readonly devToken?: string;
  readonly envLoad: ReturnType<typeof loadRootEnv>;
  readonly server?: Server;
  readonly remoteUrlSource?: RemoteUrlSource;
  readonly devTokenSource: DevTokenSource;
}

export type LoadedEnvResult = ReturnType<typeof loadRootEnv>;

export type EnvSnapshot = Pick<
  NodeJS.ProcessEnv,
  'OAK_CURRICULUM_MCP_USE_STUB_TOOLS' | 'OAK_API_KEY' | 'PORT'
>;
