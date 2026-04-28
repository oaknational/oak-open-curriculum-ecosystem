/**
 * Type declarations for the Vercel-ignore script's exported capabilities.
 *
 * The implementation lives in the sibling `.mjs` file so it can be invoked
 * directly as Vercel's `ignoreCommand` (which runs BEFORE `pnpm install`,
 * so no compilation step can be assumed). This declaration file exposes
 * a typed surface for in-repo consumers (unit tests, the e2e runtime
 * contract test) without altering the runtime artefact.
 *
 * Cites ADR-024 (DI as named capabilities), ADR-078 (DI for testability),
 * ADR-158 (multi-layer security), ADR-163 §10 (production cancellation).
 */

export interface RunVercelIgnoreCommandOptions {
  readonly repositoryRoot: string;
  readonly env: NodeJS.ProcessEnv;
  readonly stdout?: NodeJS.WritableStream;
  readonly stderr?: NodeJS.WritableStream;
  readonly readFile?: (path: string, encoding: 'utf8') => string;
  readonly gitShowFileAtSha?: (sha: string, filePath: string, cwd: string) => string;
  readonly gitFetchShallow?: (sha: string, cwd: string) => string;
}

export interface RunVercelIgnoreCommandResult {
  readonly exitCode: 0 | 1;
}

export declare function validateGitSha(value: unknown): string | null;

export declare function scrubbedGitEnv(): Record<string, string>;

export declare function gitShowFileAtSha(sha: string, filePath: string, cwd: string): string;

export declare function gitFetchShallow(sha: string, cwd: string): string;

export declare function runVercelIgnoreCommand(
  options: RunVercelIgnoreCommandOptions,
): RunVercelIgnoreCommandResult;
