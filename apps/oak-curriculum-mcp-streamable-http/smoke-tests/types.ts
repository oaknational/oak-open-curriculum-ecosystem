import type { Server } from 'node:http';
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

/**
 * Result of loading `.env` files from the repo root.
 *
 * Reports whether a file was loaded and from where.
 */
export interface LoadedEnvResult {
  readonly loaded: boolean;
  readonly path?: string;
  readonly repoRoot: string;
}

export interface PreparedEnvironment {
  readonly baseUrl: string;
  readonly devToken?: string;
  readonly envLoad: LoadedEnvResult;
  readonly server?: Server;
  readonly remoteUrlSource?: RemoteUrlSource;
  readonly devTokenSource: DevTokenSource;
}

export type EnvSnapshot = Pick<
  NodeJS.ProcessEnv,
  'OAK_CURRICULUM_MCP_USE_STUB_TOOLS' | 'OAK_API_KEY' | 'PORT'
>;
