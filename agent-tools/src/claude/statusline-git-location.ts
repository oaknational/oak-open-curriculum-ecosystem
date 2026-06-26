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
 * - `matches-working` — linked worktrees exist and a coordination branch exists,
 *   but it equals this session's working branch, so showing it would only repeat
 *   the working location. Nothing is shown: a valid empty state, distinct from
 *   `none` (this is a team checkout, not a solo one) so the suppression reason
 *   stays legible.
 * - `branch` — the resolved shared coordination branch, which diverges from the
 *   working branch and is therefore worth showing. It carries the primary
 *   checkout's display name (its directory basename) so the rendered set reads as
 *   "the primary checkout and its branch" — but `primaryName` is `undefined` when
 *   that name would merely repeat the working tree's own name. Showing the same
 *   name on both lines communicates nothing and slows a human glance, so the
 *   redundant copy is dropped (a communication-design dedup, the name-dimension
 *   sibling of `matches-working` on the branch dimension).
 * - `error` — linked worktrees exist, so a coordination branch MUST exist, but
 *   the primary checkout's branch could not be resolved. Surfaced loudly rather
 *   than silently omitted: a team with no resolvable coordination branch is a
 *   real fault to see and fix, not an empty state to hide.
 */
export type CoordinationBranch =
  | { readonly kind: 'none' }
  | { readonly kind: 'matches-working' }
  | { readonly kind: 'branch'; readonly branch: string; readonly primaryName: string | undefined }
  | { readonly kind: 'error'; readonly detail: string };

/**
 * Resolve the coordination branch to render from the team shape, the primary
 * checkout's branch and name, and this session's working branch and worktree name.
 *
 * Each coordination token is shown only when it diverges from its working-side
 * counterpart — repeating where the session already is communicates nothing to a
 * human glance:
 *
 * - The **branch**: shown only when the primary branch diverges from the working
 *   branch. When they are equal the whole line is suppressed (`matches-working`).
 *   A working branch that could not be resolved (`undefined`) cannot prove
 *   redundancy, so the branch is still shown.
 * - The **name**: carried with a shown branch, but dropped (`primaryName`
 *   `undefined`) when it equals the working tree's name — the same name on both
 *   lines is visual noise. An unresolved working worktree name (`undefined`)
 *   cannot prove redundancy, so the name is kept.
 *
 * @param input - Whether linked worktrees exist; the primary checkout's branch
 *   (`undefined` if its read failed) and display name; this session's working
 *   branch and current worktree name (each `undefined` if unresolved or in the
 *   primary checkout).
 * @returns The coordination-branch resolution; see {@link CoordinationBranch}.
 */
export function selectCoordinationBranch(input: {
  readonly hasLinkedWorktrees: boolean;
  readonly primaryBranch: string | undefined;
  readonly primaryName: string;
  readonly workingBranch: string | undefined;
  readonly workingWorktreeName: string | undefined;
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
  if (input.workingBranch !== undefined && input.primaryBranch === input.workingBranch) {
    return { kind: 'matches-working' };
  }
  const nameIsRedundant =
    input.workingWorktreeName !== undefined && input.primaryName === input.workingWorktreeName;
  return {
    kind: 'branch',
    branch: input.primaryBranch,
    primaryName: nameIsRedundant ? undefined : input.primaryName,
  };
}

/** The render-facing fields a {@link CoordinationBranch} maps to. */
export interface CoordinationParts {
  readonly coordinationBranch: string | undefined;
  /** The primary checkout's display name, shown beside the coordination branch. */
  readonly coordinationPlace: string | undefined;
  readonly error: string | undefined;
}

/**
 * Project a {@link CoordinationBranch} onto the render fields: a resolved branch
 * becomes the displayed coordination branch paired with the primary checkout's
 * name, an error becomes a loud token, and both empty states (`none` and
 * `matches-working`) become all-absent — nothing to show, and no fault to surface.
 *
 * @param coordination - The coordination-branch resolution.
 * @returns The render-facing coordination fields.
 */
export function coordinationToParts(coordination: CoordinationBranch): CoordinationParts {
  if (coordination.kind === 'branch') {
    return {
      coordinationBranch: coordination.branch,
      coordinationPlace: coordination.primaryName,
      error: undefined,
    };
  }
  if (coordination.kind === 'error') {
    return {
      coordinationBranch: undefined,
      coordinationPlace: undefined,
      error: coordination.detail,
    };
  }
  return { coordinationBranch: undefined, coordinationPlace: undefined, error: undefined };
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
