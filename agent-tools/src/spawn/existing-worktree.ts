import { isErr } from '@oaknational/result';

import { type CommandRunner } from '../core/command-runner.js';

/**
 * The spawn lane's git runner seam — a {@link CommandRunner}<string> (it captures
 * git's stdout). Returns the underlying error on a non-zero exit (ADR-088), never
 * a throw, so the failure is visible to the type system at every call site.
 *
 * @remarks
 * Aliased to the shared `core/` seam shape, which was hoisted once the gh runner
 * became the third independent consumer of the `(args, cwd) => Result<T, Error>`
 * shape (git + pnpm + gh), per consolidate-at-third-consumer. The alias keeps the
 * semantic `SpawnGitRunner` name at its call sites (`create.ts`, `git.ts`) while
 * sharing one declaration of the seam shape rather than redeclaring it.
 */
export type SpawnGitRunner = CommandRunner<string>;

/** Whether a worktree at the target path already exists, and if so on which branch. */
export type ExistingWorktree =
  | { readonly kind: 'absent' }
  | { readonly kind: 'resumable' }
  | { readonly kind: 'collision'; readonly actualBranch: string };

/**
 * Detect whether a worktree already occupies {@link worktreePath} (the
 * idempotent-retry pre-check), reading `git worktree list --porcelain` — never
 * mutating, so never-use-git-to-remove-work is respected. A list failure is
 * treated as `absent` so the subsequent `worktree add` still runs and fails loud
 * on a genuine collision; the pre-check is an optimisation, not a gate.
 */
export function detectExistingWorktree(
  runGit: SpawnGitRunner,
  coordinationHome: string,
  worktreePath: string,
  branch: string,
): ExistingWorktree {
  const listed = runGit(['worktree', 'list', '--porcelain'], coordinationHome);
  if (isErr(listed)) {
    return { kind: 'absent' };
  }
  for (const block of listed.value.split('\n\n')) {
    const lines = block.split('\n');
    const pathLine = lines.find((line) => line.startsWith('worktree '));
    if (pathLine === undefined || pathLine.slice('worktree '.length).trim() !== worktreePath) {
      continue;
    }
    const branchLine = lines.find((line) => line.startsWith('branch '));
    // refs/heads/ stripped so the match and collision report are symmetric with `branch`.
    const ref = branchLine
      ?.slice('branch '.length)
      .trim()
      .replace(/^refs\/heads\//u, '');
    if (ref === branch) {
      return { kind: 'resumable' };
    }
    return { kind: 'collision', actualBranch: ref ?? '(detached)' };
  }
  return { kind: 'absent' };
}
