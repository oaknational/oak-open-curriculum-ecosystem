import { type GitRunner, defaultRunGit } from './coordination-home.js';

/** One row of `git worktree list --porcelain`, the git ground-truth input. */
export interface GitWorktree {
  readonly path: string;
  /** Short branch name (e.g. `feat/spawn-worktree-view`), or `undefined` for a detached HEAD. */
  readonly branch?: string;
  readonly head: string;
}

/**
 * Parse `git worktree list --porcelain` into the structured worktree rows the
 * derived work-state view consumes. Pure and IO-free so it is unit-testable
 * without a repository.
 *
 * Porcelain format: blank-line-separated records, each beginning with a
 * `worktree <path>` line, then `HEAD <sha>`, then either a
 * `branch refs/heads/<name>` line or a `detached` / `bare` marker (no branch).
 * Other markers (`locked`, `prunable`) are ignored — they do not change the binding.
 */
export function parseGitWorktreeList(porcelain: string): readonly GitWorktree[] {
  const worktrees: GitWorktree[] = [];
  let path: string | undefined;
  let head = '';
  let branch: string | undefined;

  const flush = (): void => {
    if (path !== undefined) {
      worktrees.push(branch === undefined ? { path, head } : { path, branch, head });
    }
    path = undefined;
    head = '';
    branch = undefined;
  };

  for (const line of porcelain.split('\n')) {
    if (line.startsWith('worktree ')) {
      flush();
      path = line.slice('worktree '.length).trimEnd();
    } else if (line.startsWith('HEAD ')) {
      head = line.slice('HEAD '.length).trim();
    } else if (line.startsWith('branch ')) {
      const ref = line.slice('branch '.length).trim();
      branch = ref.startsWith('refs/heads/') ? ref.slice('refs/heads/'.length) : ref;
    }
  }
  flush();
  return worktrees;
}

/**
 * Read the machine's git worktrees from `cwd`. Throws when `cwd` is not inside a
 * git working tree (consistent with `resolveCoordinationHome`'s throwing
 * convention; the no-throw backlog migrates them together). The `runGit` seam
 * is injected in tests so the read is exercised without a real repository.
 */
export function readGitWorktrees(
  cwd: string,
  options: { readonly runGit?: GitRunner } = {},
): readonly GitWorktree[] {
  const runGit = options.runGit ?? defaultRunGit;
  return parseGitWorktreeList(runGit(['worktree', 'list', '--porcelain'], cwd));
}
