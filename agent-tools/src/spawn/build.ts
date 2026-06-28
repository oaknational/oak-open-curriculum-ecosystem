import { err, isErr, ok, type Result } from '@oaknational/result';

import { realPnpmRunner } from './build-runner.js';

/**
 * Runs pnpm with `args` from `cwd`, returning `ok` on a zero exit or the
 * underlying error on a non-zero exit — the Result pattern (ADR-088), never a
 * throw. The binary is always pnpm (resolved to an absolute path by the real
 * runner), so the seam takes only the args and the working directory.
 */
export type PnpmRunner = (args: readonly string[], cwd: string) => Result<void, Error>;

/** Inputs to {@link buildWorktree}. */
export interface BuildWorktreeOptions {
  /** Absolute path of the worktree to build. */
  readonly worktreePath: string;
  /** pnpm seam (defaults to the real runner; injected as a fake in tests). */
  readonly runPnpm?: PnpmRunner;
}

const defaultRunPnpm: PnpmRunner = (args, cwd) => realPnpmRunner(args, cwd);

/**
 * Install and build a freshly spawned worktree so it is ready to use
 * (spawn-flow Phase 1B — cures F-90, the unbuilt fresh worktree).
 *
 * Runs `pnpm install` then `pnpm build` in the worktree. Fails fast: if install
 * fails, build is not attempted. Returns `err` (never a throw) naming the failing
 * command and the worktree path, with the underlying error in the cause chain.
 */
export function buildWorktree(options: BuildWorktreeOptions): Result<void, Error> {
  const run = options.runPnpm ?? defaultRunPnpm;

  const installed = run(['install'], options.worktreePath);
  if (isErr(installed)) {
    return err(
      new Error(
        `spawn: 'pnpm install' failed in '${options.worktreePath}'. ${installed.error.message}`,
        { cause: installed.error },
      ),
    );
  }

  const built = run(['build'], options.worktreePath);
  if (isErr(built)) {
    return err(
      new Error(`spawn: 'pnpm build' failed in '${options.worktreePath}'. ${built.error.message}`, {
        cause: built.error,
      }),
    );
  }

  return ok(undefined);
}
