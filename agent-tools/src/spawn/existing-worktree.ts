import { isErr, type Result } from '@oaknational/result';

/**
 * Runs a git subcommand from `cwd`, returning its stdout on success or the
 * underlying error on a non-zero exit — the Result pattern (ADR-088), never a
 * throw, so the failure is visible to the type system at every call site.
 *
 * @remarks
 * Mirrors the established `GitRunner` seam shape (the injectable git seam named
 * in the spawn-flow plan), lifted into `Result`. It is declared in the spawn lane
 * rather than imported from `collaboration-state/coordination-home.ts` so the lane
 * stays decoupled from another lane's surface — the shape is the contract, and a
 * one-line type is cheaper to own than a cross-lane import. This is the spawn
 * lane's single declaration of the seam shape (shared by `create.ts`); a third
 * independent consumer is the trigger to hoist one shared seam type into `core/`
 * (consolidate-at-third-consumer).
 */
export type SpawnGitRunner = (args: readonly string[], cwd: string) => Result<string, Error>;

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
