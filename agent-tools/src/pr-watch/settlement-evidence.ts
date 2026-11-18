import { reviewConfigurationEvidence } from './review-configuration.js';
import { liveRunReviewers, runsEvidence } from './run-evidence.js';
import type { PrStateReading } from './state-types.js';

/**
 * The evidence lines every reviewer-leg verdict carries about the reading it
 * was made from: the review configuration the legs were read against, whether
 * the expected set was declared, and the run surface's gaps. One owner, so a
 * settled verdict and a blocked one name the same grounds the same way.
 *
 * @packageDocumentation
 */

function expectedSetEvidence(reading: PrStateReading): string[] {
  return reading.expectedDeclared
    ? []
    : [
        'expected reviewer set DEFAULTED from the observed surface — declare --expect for the first-round guarantee',
      ];
}

/** The configuration, the expected set's source and the run surface, on every reviewer-leg verdict. */
export function readingEvidence(reading: PrStateReading): string[] {
  return [
    reviewConfigurationEvidence(reading.reviewConfiguration),
    ...expectedSetEvidence(reading),
    ...runsEvidence(reading),
  ];
}

/** A set declared EMPTY (`--expect none`, expect-flag.ts): the one way an expected set is empty and declared. */
function declaredEmpty(reading: PrStateReading): boolean {
  return reading.expectedDeclared && reading.expectedReviewers.length === 0;
}

/**
 * The first line of a SETTLE-READY verdict. A set declared empty has no leg
 * to settle: the seat judged the work needs no pull-request review to be
 * safe and effective (the owner's word of 2026-10-27), and the quiet window
 * ran from checks green. The line names the declaration so the merge record
 * carries the judgement.
 */
export function settledLead(reading: PrStateReading): string {
  return declaredEmpty(reading)
    ? `no reviewer leg is expected: the set was declared empty (--expect none) — the seat judged this work needs no pull-request review to be safe and effective; quiet window elapsed since checks green; the door merges an empty set for the merge bot's own pull requests only, and this one's author is ${reading.author}`
    : 'every expected reviewer leg settled; quiet window elapsed';
}

/**
 * What was in flight when a set declared empty settled. A review requested
 * on the tip and a live review run hold nothing under the declaration, so
 * the record of the irreversible act names them; a review either produces
 * is harvested after the merge.
 */
export function declaredEmptyEvidence(reading: PrStateReading): string[] {
  if (!declaredEmpty(reading)) {
    return [];
  }
  const requested = reading.reviewRequests.map(
    (login) =>
      `${login}: review requested on this tip and not expected (--expect none); a review it posts is harvested after the merge`,
  );
  const live = liveRunReviewers(reading);
  return live.length === 0
    ? requested
    : [
        ...requested,
        `a review run is live for ${live.join(', ')}; the declaration does not wait for it`,
      ];
}
