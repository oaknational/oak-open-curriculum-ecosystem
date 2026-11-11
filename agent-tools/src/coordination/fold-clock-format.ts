import type { FoldClock } from './fold-clock.js';
import type { ReviewRound } from './fold-clock-rounds.js';

/**
 * The fold clock as one line for the review-cost ledger row: the ready-mark
 * in full, every later instant as a signed interval from it, the rounds by
 * reviewer with their outcome. Split from `fold-clock.ts` at the file-size
 * gate; the shape it prints is pinned by the clock's unit tests.
 */

const SHORT_SHA = 8;

function signed(minutes: number): string {
  return `${minutes < 0 ? '-' : '+'}${Math.abs(minutes).toFixed(1)} min`;
}

function checksSegment(clock: FoldClock): string {
  if (clock.requiredChecks.length === 0) {
    return 'checks: none required on the base';
  }
  if (clock.readyToGreenMinutes === undefined) {
    return `checks not green (${clock.checksMissing.join(', ')})`;
  }
  return `checks green ${signed(clock.readyToGreenMinutes)}`;
}

function describeRound(round: ReviewRound): string {
  if (round.outcome === 'reviewed') {
    return `${round.login} ${(round.minutes ?? 0).toFixed(1)} min`;
  }
  return round.outcome === 'superseded'
    ? `${round.login} request at ${round.requestedAt} superseded`
    : `${round.login} in flight since ${round.requestedAt}`;
}

function roundsSegment(rounds: readonly ReviewRound[]): string {
  return rounds.length === 0
    ? 'rounds 0'
    : `rounds ${rounds.length} (${rounds.map(describeRound).join(', ')})`;
}

function successorSegment(clock: FoldClock): string | undefined {
  if (clock.successorSha === undefined) {
    return undefined;
  }
  const short = clock.successorSha.slice(0, SHORT_SHA);
  return clock.readyToSuccessorMinutes === undefined
    ? `successor ${short} not yet on CI`
    : `successor ${short} on CI ${signed(clock.readyToSuccessorMinutes)}`;
}

/** The one line a ledger row carries. */
export function formatFoldClock(clock: FoldClock): string {
  const segments = [
    `fold-clock PR ${clock.prNumber} tip ${clock.headSha.slice(0, SHORT_SHA)}: ready ${clock.readyAt}`,
    checksSegment(clock),
    roundsSegment(clock.rounds),
    clock.readyToMergeMinutes === undefined
      ? 'not merged'
      : `merged ${signed(clock.readyToMergeMinutes)}`,
    successorSegment(clock),
  ];
  return segments.filter((segment) => segment !== undefined).join('; ');
}
