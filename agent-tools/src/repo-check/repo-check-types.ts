export interface RepoCheckCommandResult {
  readonly status: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

export interface RepoCheckRuntime {
  runInherited(command: string, args: readonly string[]): Promise<number>;
  runCaptured(command: string, args: readonly string[]): RepoCheckCommandResult;
}

export type CheckProfileFailurePhase =
  | 'passed'
  | 'environment'
  | 'turbo-task'
  | 'post-turbo-gate'
  | 'check-command';

export type PostTurboGateStatus =
  | 'not-captured'
  | 'ran'
  | 'skipped-after-turbo-failure'
  | 'not-observed';

export interface CheckProfileEnvironmentEvidence {
  readonly nodeVersion: string;
  readonly platform: NodeJS.Platform;
  readonly arch: string;
  readonly pnpmStorePath: string | null;
  readonly playwrightBrowserCachePath: string;
  readonly playwrightBrowserCacheExists: boolean;
  readonly sandboxNote: string;
}

export interface CheckProfileArtifact {
  readonly command: 'pnpm check';
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly durationMs: number;
  readonly exitCode: number;
  readonly turboDryGraph: string;
  readonly environment: CheckProfileEnvironmentEvidence;
  readonly outputLog?: string;
  readonly failurePhase: CheckProfileFailurePhase;
  readonly postTurboGateStatus: PostTurboGateStatus;
}
