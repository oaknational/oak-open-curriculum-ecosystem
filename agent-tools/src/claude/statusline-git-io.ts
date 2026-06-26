/**
 * Git I/O for the Claude Code statusline.
 *
 * @remarks
 * The single impure boundary for the statusline's git facts. It spawns git,
 * classifies each invocation through the pure {@link classifyGitOutcome}, and
 * assembles the working location and the team coordination branch via
 * {@link gatherGitFacts}.
 *
 * The two **location facts** (working branch, coordination branch) fail LOUD: an
 * unexpected git error becomes a visible error token, never a silent fallback.
 * **Cosmetic sub-details** (dirty mark, worktree name) stay best-effort — a
 * failed dirty-check must not blank the trustworthy branch fact. The one valid
 * empty state — a directory outside any git repository — renders as "no branch",
 * distinct from an error.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { basename } from 'node:path';

import { resolveTrustedGit } from '../core/trusted-git.js';

import {
  classifyGitOutcome,
  coordinationToParts,
  countWorktrees,
  parsePrimaryWorktreeRoot,
  selectCoordinationBranch,
  type GitExit,
  type GitOutcome,
} from './statusline-git-location.js';

/** The git facts a single statusline render needs. */
export interface GitFacts {
  /** The session's working-directory branch (or short SHA on a detached HEAD). */
  readonly branch: string | undefined;
  /** Whether the working tree has tracked or untracked changes. */
  readonly dirty: boolean;
  /** Linked-worktree name; absent in the main working tree. */
  readonly worktree: string | undefined;
  /** The team's shared coordination branch, when linked worktrees exist. */
  readonly coordinationBranch: string | undefined;
  /** The primary checkout's display name, shown beside the coordination branch. */
  readonly coordinationPlace: string | undefined;
  /** A loud location-fact failure to surface, or `undefined`. */
  readonly error: string | undefined;
  /** The primary checkout root, for the coordination-shape reads. */
  readonly primaryRoot: string | undefined;
}

/**
 * Gather every git fact the statusline renders, from the session's working
 * directory. One `git worktree list` read is shared by the coordination
 * resolution and the returned `primaryRoot` (which the session-shape reads need).
 *
 * @param cwd - The session's working directory.
 * @returns The resolved git facts; see {@link GitFacts}.
 */
export function gatherGitFacts(cwd: string): GitFacts {
  const working = gatherGitState(cwd);
  const listing = classifyGitOutcome(spawnGit(cwd, ['worktree', 'list', '--porcelain']));
  const primaryRoot =
    listing.kind === 'value' ? parsePrimaryWorktreeRoot(listing.value) : undefined;
  const coordination = resolveCoordination(listing, primaryRoot, working.branch, working.worktree);
  return {
    branch: working.branch,
    dirty: working.dirty,
    worktree: working.worktree,
    coordinationBranch: coordination.coordinationBranch,
    coordinationPlace: coordination.coordinationPlace,
    error: combineErrors(working.error, coordination.error),
    primaryRoot,
  };
}

interface GitState {
  readonly branch: string | undefined;
  readonly dirty: boolean;
  readonly worktree: string | undefined;
  /** A loud branch-resolution failure; `undefined` when resolved or outside a repository. */
  readonly error: string | undefined;
}

function gatherGitState(cwd: string): GitState {
  const { branch, error } = resolveBranch(cwd);
  if (branch === undefined) {
    // No branch — outside a repository (valid, no error) or a loud failure.
    // Either way there is no dirty/worktree detail to gather.
    return { branch: undefined, dirty: false, worktree: undefined, error };
  }

  // Cosmetic sub-details degrade softly: a failed dirty-check or worktree probe
  // must not blank the trustworthy branch fact, so these stay best-effort.
  const dirty = (runGit(cwd, ['status', '--porcelain']) ?? '').length > 0;

  // In the main tree --git-dir and --git-common-dir are equal; in a linked
  // worktree they differ (.../.git/worktrees/<name> vs .../.git).
  const gitDir = runGit(cwd, ['rev-parse', '--git-dir']);
  const commonDir = runGit(cwd, ['rev-parse', '--git-common-dir']);
  const topLevel = runGit(cwd, ['rev-parse', '--show-toplevel']);
  const worktree =
    gitDir !== undefined && gitDir !== commonDir && topLevel !== undefined
      ? basename(topLevel)
      : undefined;

  return { branch, dirty, worktree, error: undefined };
}

/**
 * Resolve a directory's branch, failing loud. Returns the symbolic branch name,
 * the short SHA for a detached HEAD, or no branch and no error when the directory
 * is outside any git repository (a valid empty state). Any other git failure
 * returns a loud error rather than a silent `undefined` rendered as "no branch".
 */
function resolveBranch(cwd: string): { branch: string | undefined; error: string | undefined } {
  const symbolic = classifyGitOutcome(spawnGit(cwd, ['symbolic-ref', '--short', 'HEAD']));
  if (symbolic.kind === 'value') {
    return { branch: symbolic.value, error: undefined };
  }
  if (symbolic.kind === 'outside-repo') {
    // Outside a repository — valid, and no second spawn needed to disambiguate.
    return { branch: undefined, error: undefined };
  }
  // symbolic-ref also fails on a detached HEAD; rev-parse disambiguates: a short
  // SHA is a detached HEAD (valid), anything else is a loud error.
  const revision = classifyGitOutcome(spawnGit(cwd, ['rev-parse', '--short', 'HEAD']));
  if (revision.kind === 'value') {
    return { branch: revision.value, error: undefined };
  }
  if (revision.kind === 'outside-repo') {
    return { branch: undefined, error: undefined };
  }
  const detail = revision.kind === 'error' ? revision.detail : 'HEAD resolved empty';
  return { branch: undefined, error: `branch unresolved: ${detail}` };
}

/**
 * Resolve the coordination branch to display from the worktree listing, failing
 * loud. A worktree-list error, an unresolvable primary checkout root in a team,
 * or an unresolvable primary branch each surface an error rather than silently
 * omitting the coordination line. Each coordination token is suppressed when it
 * would merely repeat its working-side counterpart: the whole line when the
 * coordination branch equals the working branch, and the primary name alone when
 * it equals the working worktree name — see {@link selectCoordinationBranch}.
 *
 * @param listing - The classified `git worktree list --porcelain` outcome.
 * @param primaryRoot - The primary checkout root, or `undefined` if unresolved.
 * @param workingBranch - This session's working branch, used to suppress a
 *   coordination line that would merely repeat it; `undefined` if unresolved.
 * @param workingWorktreeName - This session's current worktree name, used to drop
 *   a primary name that would merely repeat it; `undefined` in the primary
 *   checkout or if unresolved.
 */
function resolveCoordination(
  listing: GitOutcome,
  primaryRoot: string | undefined,
  workingBranch: string | undefined,
  workingWorktreeName: string | undefined,
): {
  coordinationBranch: string | undefined;
  coordinationPlace: string | undefined;
  error: string | undefined;
} {
  if (listing.kind === 'outside-repo' || listing.kind === 'empty') {
    return { coordinationBranch: undefined, coordinationPlace: undefined, error: undefined };
  }
  if (listing.kind === 'error') {
    return {
      coordinationBranch: undefined,
      coordinationPlace: undefined,
      error: `worktree list unresolved: ${listing.detail}`,
    };
  }
  const hasLinkedWorktrees = countWorktrees(listing.value) > 1;
  if (primaryRoot === undefined) {
    return {
      coordinationBranch: undefined,
      coordinationPlace: undefined,
      error: hasLinkedWorktrees ? 'primary checkout root unresolved' : undefined,
    };
  }
  const primary = resolveBranch(primaryRoot);
  if (primary.error !== undefined) {
    return { coordinationBranch: undefined, coordinationPlace: undefined, error: primary.error };
  }
  return coordinationToParts(
    selectCoordinationBranch({
      hasLinkedWorktrees,
      primaryBranch: primary.branch,
      primaryName: basename(primaryRoot),
      workingBranch,
      workingWorktreeName,
    }),
  );
}

/** Join the two location-fact errors into one loud token, or `undefined`. */
function combineErrors(
  working: string | undefined,
  coordination: string | undefined,
): string | undefined {
  const present = [working, coordination].filter((error): error is string => error !== undefined);
  return present.length === 0 ? undefined : present.join('; ');
}

/** Run git for a best-effort cosmetic read: the trimmed value, or `undefined` on any non-value outcome. */
function runGit(cwd: string, args: readonly string[]): string | undefined {
  const outcome = classifyGitOutcome(spawnGit(cwd, args));
  return outcome.kind === 'value' ? outcome.value : undefined;
}

/**
 * Invoke git against a directory and capture the raw exit for classification.
 * `spawnSync` with an encoding can still return `null` stdout/stderr if the
 * stream was not captured, so both are coerced to a string for the classifier.
 */
function spawnGit(cwd: string, args: readonly string[]): GitExit {
  // Execute git by its absolute path (resolveTrustedGit) so a writable PATH entry
  // cannot shadow it (SonarCloud S4036). resolveTrustedGit throws when no trusted
  // git exists; the statusline is a best-effort cosmetic read, so a missing git is
  // a non-value outcome (status null, like a spawn failure), never a render crash.
  let gitBinary: string;
  try {
    gitBinary = resolveTrustedGit();
  } catch (error) {
    return {
      status: null,
      stdout: '',
      stderr: error instanceof Error ? error.message : String(error),
    };
  }
  const result = spawnSync(gitBinary, ['-C', cwd, ...args], { encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}
