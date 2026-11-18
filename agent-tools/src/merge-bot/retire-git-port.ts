import type { Result } from '@oaknational/result';

import type { CasOutcome, PlannedDelete, RetireReadings } from './retire-decision.js';
import { deletePlannedRef, removeBranchConfig } from './retire-git-delete.js';
import { readOriginUrls } from './retire-git-read.js';
import type { RetireGit } from './retire-git-run.js';
import { gatherReadings } from './retire-readings.js';
import { worktreesUsing } from './retire-worktrees.js';

/**
 * What `merge-bot retire` asks of git, in its own terms. The front door and
 * the executor reach git only through this port, so their tests answer it
 * with constant readings and outcomes, never with git's argv; the real port
 * runs against real git in the smokes. No operation mirrors a git command:
 * each is a question the command asks or a write it makes.
 */
export interface RetireGitPort {
  /** origin's raw configured URLs, in config order; none is an empty list. */
  readonly originUrls: () => Promise<Result<readonly string[], Error>>;
  /** Every reading the retire decision needs. */
  readonly readings: (branch: string) => Promise<Result<RetireReadings, Error>>;
  /** The worktrees (by basename) using the branch now, read again just before the local deletes. */
  readonly inUseBy: (branch: string) => Promise<Result<readonly string[], Error>>;
  /** Delete one planned ref by compare-and-swap, and say what it left. */
  readonly deleteRef: (target: PlannedDelete) => Promise<Result<CasOutcome, Error>>;
  /** Remove the branch's section from the repository's own config while no local branch has its name; none is not a failure. */
  readonly removeBranchConfig: (branch: string) => Promise<Result<undefined, Error>>;
}

/** The port over real git in one checkout. */
export function gitRetirePort(retire: RetireGit): RetireGitPort {
  return {
    originUrls: () => readOriginUrls(retire),
    readings: (branch) => gatherReadings(retire, branch),
    inUseBy: (branch) => worktreesUsing(retire, branch),
    deleteRef: (target) => deletePlannedRef(retire, target),
    removeBranchConfig: (branch) => removeBranchConfig(retire, branch),
  };
}
