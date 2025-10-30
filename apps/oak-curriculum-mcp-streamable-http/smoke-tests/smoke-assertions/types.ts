import type { Logger } from '@oaknational/mcp-logger';

export type SmokeSuiteMode = 'local-stub' | 'local-live' | 'local-live-auth' | 'remote';

export type RemoteUrlSource = 'cli' | 'smokeRemoteBaseUrl' | 'oakMcpUrl';
export type DevTokenSource =
  | 'stub-default'
  | 'cli'
  | 'env'
  | 'fallback'
  | 'not-required'
  | 'not-applicable-auth-disabled'
  | 'not-applicable-remote-uses-oauth';

export interface SmokeMetadata {
  readonly devTokenSource: DevTokenSource;
  readonly envFilePath?: string;
  readonly envFileLoaded: boolean;
  readonly repoRoot: string;
  readonly remoteUrlSource?: RemoteUrlSource;
}

export interface SmokeContext {
  readonly baseUrl: string;
  readonly devToken?: string;
  readonly mode: SmokeSuiteMode;
  readonly logger: Logger;
  readonly metadata: SmokeMetadata;
  readonly logToFile: boolean;
  readonly logDirectory: string;
  readonly captureAnalysis: boolean;
}

export const REQUIRED_ACCEPT = 'application/json, text/event-stream';
export const EXPECTED_TOOLS = [
  'search',
  'fetch',
  'get-key-stages-subject-lessons',
  'get-lessons-assets',
  'get-lessons-summary',
  'get-units-summary',
] as const;
