import { normaliseLogin } from './logins.js';
import type { ReviewerLeg } from './reviewer-legs.js';

/**
 * The fold from per-reviewer legs to the one blocking verdict (pr-lifecycle
 * SKILL item 4's gate over item 3's legs): which OWED leg, if any, holds the
 * round, and whether it is a round in flight or a leg nobody is serving.
 *
 * @packageDocumentation
 */

/** The most blocking unresolved leg, or `settled` when nothing is OWED. */
export type BlockingLegVerdict =
  | { readonly kind: 'settled' }
  | {
      readonly kind:
        | 'SILENT-WAIT-RUN-DEAD'
        | 'SILENT-WAIT-RUNS-UNREADABLE'
        | 'SILENT-WAIT-NO-REVIEWER'
        | 'WAITING-REVIEW-RUN-LIVE';
      readonly reviewer: string;
    };

export interface MostBlockingLegInput {
  readonly legs: readonly ReviewerLeg[];
  readonly reviewRequests: readonly string[];
  /** Reviewers with a live review run associated (bounded vendor mapping). */
  readonly liveRunReviewers: readonly string[];
  /** False when the run surface could not be read — deadness is then never asserted. */
  readonly runsReadable: boolean;
}

/**
 * Resolve OWED legs to the most blocking per-reviewer verdict: a requested
 * reviewer with NO live run (run dead / never started) outranks an
 * unrequested reviewer, which outranks a benign live-run wait — so one
 * reviewer's live run can never mask another reviewer's stalled leg.
 */
export function mostBlockingLeg(input: MostBlockingLegInput): BlockingLegVerdict {
  const owed = input.legs.filter((leg) => leg.state === 'OWED');
  const requested = new Set(input.reviewRequests.map((login) => normaliseLogin(login)));
  const live = new Set(input.liveRunReviewers.map((login) => normaliseLogin(login)));

  const runDead = owed.find(
    (leg) => requested.has(normaliseLogin(leg.reviewer)) && !live.has(normaliseLogin(leg.reviewer)),
  );
  if (runDead !== undefined) {
    // An unreadable run surface never asserts deadness (typed uncertainty).
    return input.runsReadable
      ? { kind: 'SILENT-WAIT-RUN-DEAD', reviewer: runDead.reviewer }
      : { kind: 'SILENT-WAIT-RUNS-UNREADABLE', reviewer: runDead.reviewer };
  }
  const unrequested = owed.find((leg) => !requested.has(normaliseLogin(leg.reviewer)));
  if (unrequested !== undefined) {
    return { kind: 'SILENT-WAIT-NO-REVIEWER', reviewer: unrequested.reviewer };
  }
  const waiting = owed[0];
  if (waiting !== undefined) {
    return { kind: 'WAITING-REVIEW-RUN-LIVE', reviewer: waiting.reviewer };
  }
  return { kind: 'settled' };
}
