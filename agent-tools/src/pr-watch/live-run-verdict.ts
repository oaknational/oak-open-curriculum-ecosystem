import type { ReviewerLeg } from './reviewer-legs.js';
import { hasLiveReviewRun } from './run-evidence.js';
import { readingEvidence } from './settlement-evidence.js';
import type { PrStateReading, PrVerdict } from './state-types.js';

/**
 * The hold a live review run places on a round whose legs are otherwise
 * settled. Split from `settlement.ts`, which composes it.
 *
 * @packageDocumentation
 */

/**
 * A review run in flight for the pull request holds a round whose legs are
 * otherwise settled: a run carries no reviewer identity, so one that maps to
 * no pending request backs no leg, and a review in progress is waited for
 * whoever it is by. A leg the timeout arm has ended is the exception: that
 * round reads SETTLED-NO-REVIEW, which refuses, so a watch can end.
 *
 * @returns the waiting verdict, or `undefined` when no run is live or a leg
 *   has timed out
 */
export function liveRunVerdict(
  reading: PrStateReading,
  legs: readonly ReviewerLeg[],
): PrVerdict | undefined {
  const timedOut = legs.some((leg) => leg.state === 'SKIPPED' && leg.skipReason === 'timeout');
  if (!hasLiveReviewRun(reading) || timedOut) {
    return undefined;
  }
  return {
    state: 'WAITING-REVIEW-RUN-LIVE',
    evidence: [
      'a review run is live for this pull request and maps to no pending request — a review in progress is waited for',
      ...legs.map((leg) => `${leg.reviewer}: ${leg.state} — ${leg.detail}`),
      ...readingEvidence(reading),
    ],
  };
}
