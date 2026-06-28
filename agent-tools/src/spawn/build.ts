import { err, isErr, ok, type Result } from '@oaknational/result';

import { type CommandRunner } from '../core/command-runner.js';

import { realPnpmRunner } from './build-runner.js';

/**
 * The pnpm runner seam — a {@link CommandRunner}<void>. pnpm inherits stdio so the
 * caller sees install/build progress directly and there is no stdout to capture;
 * the seam only signals success (`ok`) or the underlying error on a non-zero exit
 * (ADR-088), never a throw.
 *
 * @remarks
 * Aliased to the shared `core/` seam shape, which was hoisted once the gh runner
 * became the third independent consumer (git + pnpm + gh), per
 * consolidate-at-third-consumer.
 */
export type PnpmRunner = CommandRunner<void>;

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
