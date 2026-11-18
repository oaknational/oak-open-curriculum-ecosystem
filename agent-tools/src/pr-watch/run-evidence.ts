import type { PrStateReading } from './state-types.js';

/**
 * The review-run leg as the settlement half reads it: the typed
 * degradation's evidence line, the bounded run-to-reviewer mapping, and the
 * note for a live run that maps to no request.
 */

export function runsEvidence(reading: PrStateReading): string[] {
  if (reading.reviewRuns.kind === 'unavailable') {
    return [`review-run liveness unavailable: ${reading.reviewRuns.reason}`];
  }
  return reading.reviewRuns.note === undefined ? [] : [reading.reviewRuns.note];
}

// Bounded vendor mapping: `gh agent-task` runs carry no reviewer identity, so
// a live PR-scoped run backs the legs of reviewers with an OUTSTANDING
// request (the run IS the requested round in flight); it cannot distinguish
// which of several requested reviewers it serves.
export function liveRunReviewers(reading: PrStateReading): readonly string[] {
  const hasLiveRun =
    reading.reviewRuns.kind === 'read' &&
    reading.reviewRuns.runs.some((run) => run.completedAt === null);
  return hasLiveRun ? reading.reviewRequests : [];
}

// A live run that maps to no outstanding request (app-style reviews) cannot
// back a leg; name it so SILENT-WAIT never reads as "nothing is happening".
export function unmappedLiveRunEvidence(reading: PrStateReading, blockingKind: string): string[] {
  const hasUnmappedLiveRun =
    blockingKind === 'SILENT-WAIT-NO-REVIEWER' &&
    liveRunReviewers(reading).length === 0 &&
    reading.reviewRuns.kind === 'read' &&
    reading.reviewRuns.runs.some((run) => run.completedAt === null);
  return hasUnmappedLiveRun
    ? ['note: a review run IS live for this PR, unmapped to any request']
    : [];
}
