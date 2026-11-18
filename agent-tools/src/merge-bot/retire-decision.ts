import { printable } from '../pr-watch/printable.js';
import type { DefaultBranchReading, RemoteRefReading } from './retire-parse.js';

/**
 * The retire decision: every reading `merge-bot retire` gathered, in; a
 * refusal, "nothing to retire", or a delete plan, out. Pure, so every refusal
 * and every outcome word is proven in one place without git.
 *
 * The plan is the ONLY way to name a delete. A `PlannedDelete` is an
 * instance of a class this module does not export, and its ES-private fields
 * make the type nominal: no object literal satisfies it. The delete functions
 * accept only planned entries, so no sha that the decision did not prove can
 * reach `update-ref` or the remote delete, whatever order a caller runs
 * things in.
 */

/** One ref the decision proved on the default branch, with the sha it was proven at. */
class Planned {
  readonly #ref: string;
  readonly #expectedSha: string;

  constructor(ref: string, expectedSha: string) {
    this.#ref = ref;
    this.#expectedSha = expectedSha;
  }

  /** The full refname to delete. */
  get ref(): string {
    return this.#ref;
  }

  /** The sha the ref was proven at; the compare-and-swap's expected value. */
  get expectedSha(): string {
    return this.#expectedSha;
  }
}

export type PlannedDelete = Planned;

/** A tip as read: its sha, and whether it is an ancestor of the default branch's tip. */
export interface TipState {
  readonly sha: string;
  readonly onBase: boolean;
}

/** Everything the decision reads. A tip that does not exist is undefined. */
export interface RetireReadings {
  readonly branch: string;
  readonly base: DefaultBranchReading;
  /** `refs/heads/<branch>`. */
  readonly local: TipState | undefined;
  /** `refs/remotes/origin/<branch>`, as cached before any fetch. */
  readonly tracking: TipState | undefined;
  /** The remote's `refs/heads/<branch>`, as the probe read it. */
  readonly remote: TipState | undefined;
  /** Worktrees (by basename) that have the branch checked out or mid-rebase or bisect. */
  readonly inUseBy: readonly string[];
  /** Other existing refs whose names equal this branch's when case is ignored. */
  readonly caseCollisions: readonly string[];
  /** The branch's own local or tracking refs that are symbolic. */
  readonly symbolic: readonly string[];
}

/** The names to delete. Only the decision builds one. */
export interface RetirePlan {
  readonly remote: PlannedDelete | undefined;
  readonly tracking: PlannedDelete | undefined;
  readonly local: PlannedDelete | undefined;
}

export type RetireDecision =
  | { readonly kind: 'refused'; readonly reason: string }
  | { readonly kind: 'absent' }
  | { readonly kind: 'plan'; readonly plan: RetirePlan };

function planned(ref: string, tip: TipState | undefined): PlannedDelete | undefined {
  return tip === undefined ? undefined : new Planned(ref, tip.sha);
}

/** A refusal decided before the tips are looked at, or undefined when none applies. */
function standingRefusal(readings: RetireReadings): string | undefined {
  if (readings.branch.toLowerCase() === readings.base.name.toLowerCase()) {
    return `"${readings.branch}" is the repository's default branch; it is never retired`;
  }
  if (readings.symbolic.length > 0) {
    return `${readings.symbolic.join(', ')} is a symbolic ref, which this command does not retire; retire it by hand`;
  }
  if (readings.caseCollisions.length > 0) {
    return `"${readings.branch}" matches ${readings.caseCollisions.join(', ')} when case is ignored; on a case-insensitive filesystem a delete could land on either, so retire it by hand`;
  }
  if (readings.inUseBy.length > 0) {
    return `"${readings.branch}" is in use in worktree ${readings.inUseBy.join(', ')}; remove that worktree (or prune it) first`;
  }
  return undefined;
}

const TIP_LABELS = [
  ['local', 'the local branch'],
  ['tracking', 'the cached tracking ref'],
  ['remote', 'the remote branch'],
] as const;

/** Decide what to retire. */
export function decideRetirement(readings: RetireReadings): RetireDecision {
  const standing = standingRefusal(readings);
  if (standing !== undefined) {
    return { kind: 'refused', reason: standing };
  }
  const base = `${readings.base.name}@${readings.base.sha}`;
  for (const [key, label] of TIP_LABELS) {
    const tip = readings[key];
    if (tip !== undefined && !tip.onBase) {
      return {
        kind: 'refused',
        reason: `${label} is at ${tip.sha}, which is not an ancestor of ${base}: it holds commits the default lacks; surface it, never delete it`,
      };
    }
  }
  if (
    readings.local === undefined &&
    readings.tracking === undefined &&
    readings.remote === undefined
  ) {
    return { kind: 'absent' };
  }
  return {
    kind: 'plan',
    plan: {
      remote: planned(`refs/heads/${readings.branch}`, readings.remote),
      tracking: planned(`refs/remotes/origin/${readings.branch}`, readings.tracking),
      local: planned(`refs/heads/${readings.branch}`, readings.local),
    },
  };
}

/** The remote ref re-read just before its delete, against the sha it was proven at. */
export function classifyRemoteReread(
  target: PlannedDelete,
  reread: RemoteRefReading,
): 'same' | 'absent' | 'moved' {
  if (reread.kind === 'absent') {
    return 'absent';
  }
  return reread.sha === target.expectedSha ? 'same' : 'moved';
}

/** What the remote delete left, read back after GitHub answered. */
export type RemoteDeleteOutcome =
  | { readonly kind: 'deleted' }
  | { readonly kind: 'absent' }
  | { readonly kind: 'unchanged' }
  | { readonly kind: 'moved'; readonly sha: string }
  | { readonly kind: 'replaced'; readonly sha: string };

/**
 * Classify the remote delete by the ref read back, never by GitHub's answer
 * alone: a stale `beforeOid` answers a generic error, and a 5xx can follow a
 * delete that happened. The ref gone after an accepted delete is this
 * command's delete; gone after a refused one is reported absent, since
 * either another writer removed it or the delete happened behind an error.
 * A ref at another sha after an ACCEPTED delete was deleted and then
 * re-created (replaced); after a refused one, it moved after its proof, or
 * was re-created after a delete that happened behind the error, and which
 * is not known (moved).
 */
export function classifyRemoteReadback(
  target: PlannedDelete,
  accepted: boolean,
  readback: RemoteRefReading,
): RemoteDeleteOutcome {
  if (readback.kind === 'absent') {
    return { kind: accepted ? 'deleted' : 'absent' };
  }
  if (readback.sha === target.expectedSha) {
    return { kind: 'unchanged' };
  }
  return { kind: accepted ? 'replaced' : 'moved', sha: readback.sha };
}

/**
 * Whether the identity's repository, read through GitHub at the mint, has
 * the default branch the proofs were made on, by name and by tip. `origin`'s
 * traffic can be rewritten (`insteadOf`), so the repository git read may not
 * be the one the bot deletes in; equal shas make the proofs hold in both,
 * because ancestry is a fact about commits, not about repositories. That
 * holds because the proofs read the commits as they are: replacement refs
 * and grafts, which can give a commit other parents, are off for every read.
 */
export function baseMismatch(
  proven: DefaultBranchReading,
  read: DefaultBranchReading | undefined,
): string | undefined {
  if (read?.name === proven.name && read.sha === proven.sha) {
    return undefined;
  }
  const seen = read === undefined ? 'no default branch' : `${printable(read.name)}@${read.sha}`;
  return `the bot's repository reads ${seen} as its default, not ${proven.name}@${proven.sha} as proven: origin's traffic reaches another repository, or the default moved; re-run`;
}

/** What a local compare-and-swap delete left behind. */
export type CasOutcome =
  | { readonly kind: 'deleted' }
  | { readonly kind: 'absent' }
  | { readonly kind: 'kept'; readonly sha: string }
  | { readonly kind: 'unchanged'; readonly detail: string };

/** A local compare-and-swap delete as run: its exit, the ref re-read after a failure, git's words. */
export interface CasReading {
  readonly exitedClean: boolean;
  /** The ref's sha re-read after a non-zero exit; undefined when it is gone. */
  readonly rereadSha: string | undefined;
  readonly detail: string;
}

/**
 * Classify `update-ref -d <ref> <expected>` by the ref it left, never by its
 * text: git exits 1 when the ref was already gone, when it had moved, and
 * when it could not be locked. Only a ref at ANOTHER sha moved; one still at
 * the proven sha is a delete that failed, reported with git's words.
 */
export function classifyCasOutcome(target: PlannedDelete, reading: CasReading): CasOutcome {
  if (reading.exitedClean) {
    return { kind: 'deleted' };
  }
  if (reading.rereadSha === undefined) {
    return { kind: 'absent' };
  }
  return reading.rereadSha === target.expectedSha
    ? { kind: 'unchanged', detail: reading.detail }
    : { kind: 'kept', sha: reading.rereadSha };
}
