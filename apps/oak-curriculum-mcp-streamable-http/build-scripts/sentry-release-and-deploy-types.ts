/**
 * Type contracts for the Sentry release-and-deploy orchestrator.
 *
 * @remarks Extracted to its own module to give `sentry-release-and-deploy.ts`
 * (orchestration) and `sentry-release-and-deploy-cli.ts` (composition
 * root) a shared type boundary with one-way dependency flow. No file
 * imports from the orchestrator or CLI files — cycle-free by design.
 */

export interface CliResponse {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}

/** Minimal write sink — structural subtype of NodeJS.WritableStream. */
export interface OrchestratorWriteSink {
  write(chunk: string | Uint8Array): boolean;
}

export interface RunSentryReleaseAndDeployOptions {
  readonly env: Readonly<Record<string, string | undefined>>;
  readonly repositoryRoot: string;
  readonly appDir: string;
  readonly readFile: (path: string) => string;
  readonly readdirSync: (path: string) => readonly string[];
  readonly existsSync: (path: string) => boolean;
  readonly execCli: (argv: readonly string[]) => CliResponse;
  readonly execScript: (path: string, scriptEnv: Readonly<Record<string, string>>) => CliResponse;
  readonly stdout: OrchestratorWriteSink;
  readonly stderr: OrchestratorWriteSink;
}

export type OrchestratorResult =
  | { readonly exitCode: 0; readonly kind: 'success' | 'skipped' }
  | {
      readonly exitCode: 1;
      readonly kind: 'preflight' | 'abort_step';
      readonly failedStep?: string;
      readonly reason: string;
    };
