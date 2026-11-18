export interface RepoCheckCommandResult {
  readonly status: number | null;
  /** The killing signal when `status` is null — named so a signal death is diagnosable (F-112). */
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
}

export interface RepoCheckRuntime {
  runInherited(command: string, args: readonly string[]): Promise<number>;
  runCaptured(command: string, args: readonly string[]): RepoCheckCommandResult;
}

export type CheckProfileFailurePhase =
  'passed' | 'environment' | 'turbo-task' | 'post-turbo-gate' | 'check-command';

export type PostTurboGateStatus =
  'not-captured' | 'ran' | 'skipped-after-turbo-failure' | 'not-observed';

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
  /** The leg a failed captured run stopped in: the last whose start line the output carries. */
  readonly failedLeg?: string;
  readonly postTurboGateStatus: PostTurboGateStatus;
}
