/**
 * Pure git-location resolution for the Claude Code statusline.
 *
 * @remarks
 * The statusline shows two distinct git facts: the session's **working
 * location** (the branch of its current working directory) and, in a team
 * checkout with linked worktrees, the shared **coordination branch** (the
 * primary checkout's branch). This module holds the pure decisions behind both,
 * plus the fail-loud classification of a raw git invocation.
 *
 * Fail-loud, not soft. The prior statusline swallowed every git failure to
 * `undefined`, so an unexpected git error rendered identically to a clean
 * checkout. {@link classifyGitOutcome} keeps the one genuinely-valid empty state
 * ("this directory is outside any git repository") distinct from an unexpected
 * git error, which the adapter surfaces as a visible token rather than swallowing
 * it. (This surfaces git *failures*; it does not, by itself, make a session's
 * working location correct when the cwd it is given is not the agent's worktree —
 * that binding is a separate, unsolved concern.)
 *
 * @packageDocumentation
 */

/** A raw git invocation result, as produced by `spawnSync('git', …)`. */
export interface GitExit {
  /** Process exit status; `null` when the process was killed by a signal. */
  readonly status: number | null;
  /** Captured stdout. */
  readonly stdout: string;
  /** Captured stderr. */
  readonly stderr: string;
}

/**
 * A git invocation classified for fail-loud handling.
 *
 * - `value` — exited cleanly with output (trimmed, non-empty).
 * - `empty` — exited cleanly with no output (e.g. a clean `status --porcelain`).
 * - `outside-repo` — the directory is outside any git repository: a valid state
 *   that renders as "no branch", never an error.
 * - `error` — any other non-zero exit: surfaced loudly, never swallowed.
 */
export type GitOutcome =
  | { readonly kind: 'value'; readonly value: string }
  | { readonly kind: 'empty' }
  | { readonly kind: 'outside-repo' }
  | { readonly kind: 'error'; readonly detail: string };

/** stderr fragment git emits when the working directory is outside a repository. */
const NOT_A_REPOSITORY = /not a git repository/i;

/**
 * Classify a raw git invocation, distinguishing the one valid empty state
 * (outside a repository) from an unexpected error that must be surfaced.
 *
 * @param exit - The raw `spawnSync` result fields.
 * @returns The classified outcome.
 */
export function classifyGitOutcome(exit: GitExit): GitOutcome {
  if (exit.status === 0) {
    const value = exit.stdout.trim();
    return value.length === 0 ? { kind: 'empty' } : { kind: 'value', value };
  }
  if (NOT_A_REPOSITORY.test(exit.stderr)) {
    return { kind: 'outside-repo' };
  }
  const detail = exit.stderr.trim();
  return {
    kind: 'error',
    detail: detail.length === 0 ? `git exited ${exit.status ?? 'on signal'}` : detail,
  };
}

/**
 * Count worktrees in `git worktree list --porcelain` output. The main working
 * tree is always the first entry; more than one means linked worktrees exist —
 * the signal that this is a team checkout sharing a coordination branch.
 *
 * @param porcelain - Raw `git worktree list --porcelain` stdout.
 * @returns The number of `worktree <path>` records.
 */
export function countWorktrees(porcelain: string): number {
  return (porcelain.match(/^worktree /gm) ?? []).length;
}

/**
 * The coordination-branch resolution to render.
 *
 * - `none` — a solo checkout with no linked worktrees. There is genuinely no
 *   coordination branch, so nothing is shown: a valid empty state.
 * - `branch` — the resolved shared coordination branch.
 * - `error` — linked worktrees exist, so a coordination branch MUST exist, but
 *   the primary checkout's branch could not be resolved. Surfaced loudly rather
 *   than silently omitted: a team with no resolvable coordination branch is a
 *   real fault to see and fix, not an empty state to hide.
 */
export type CoordinationBranch =
  | { readonly kind: 'none' }
  | { readonly kind: 'branch'; readonly branch: string }
  | { readonly kind: 'error'; readonly detail: string };

/**
 * Resolve the coordination branch to render from the team shape and the primary
 * checkout's branch.
 *
 * @param input - Whether linked worktrees exist, and the primary checkout's
 *   branch (already resolved by the caller, `undefined` if its read failed).
 * @returns The coordination-branch resolution; see {@link CoordinationBranch}.
 */
export function selectCoordinationBranch(input: {
  readonly hasLinkedWorktrees: boolean;
  readonly primaryBranch: string | undefined;
}): CoordinationBranch {
  if (!input.hasLinkedWorktrees) {
    return { kind: 'none' };
  }
  if (input.primaryBranch === undefined) {
    return {
      kind: 'error',
      detail: 'linked worktrees exist but the primary checkout branch is unresolved',
    };
  }
  return { kind: 'branch', branch: input.primaryBranch };
}

/** The render-facing fields a {@link CoordinationBranch} maps to. */
export interface CoordinationParts {
  readonly coordinationBranch: string | undefined;
  readonly error: string | undefined;
}

/**
 * Project a {@link CoordinationBranch} onto the render fields: a resolved branch
 * becomes the displayed coordination branch, an error becomes a loud token, and
 * `none` becomes both-absent (a valid empty state).
 *
 * @param coordination - The coordination-branch resolution.
 * @returns The render-facing coordination fields.
 */
export function coordinationToParts(coordination: CoordinationBranch): CoordinationParts {
  if (coordination.kind === 'branch') {
    return { coordinationBranch: coordination.branch, error: undefined };
  }
  if (coordination.kind === 'error') {
    return { coordinationBranch: undefined, error: coordination.detail };
  }
  return { coordinationBranch: undefined, error: undefined };
}

/**
 * Resolve the PRIMARY checkout root from `git worktree list --porcelain` output:
 * the first `worktree <path>` line. Git documents list order as the main working
 * tree first; the statusline relies on that contract so a worktree seat reads the
 * primary checkout's live coordination registry rather than its own stale copy.
 * Returns `undefined` on unrecognised output (the caller soft-fails the
 * coordination reads for the tick).
 *
 * @param porcelainOutput - Raw `git worktree list --porcelain` stdout.
 * @returns The primary checkout's absolute path, or `undefined`.
 */
export function parsePrimaryWorktreeRoot(porcelainOutput: string): string | undefined {
  const firstLine = porcelainOutput.split('\n', 1)[0] ?? '';
  if (!firstLine.startsWith('worktree ')) {
    return undefined;
  }
  const path = firstLine.slice('worktree '.length).trim();
  return path.length === 0 ? undefined : path;
}
