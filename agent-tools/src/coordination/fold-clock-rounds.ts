import { minutesBetween } from './fold-clock-time.js';

/**
 * Review rounds from the timeline's requests and reviews, swept in time
 * order per reviewer login: a request opens a round; a newer request of the
 * same login supersedes the open one at once (a re-request before the review
 * lands replaces it, so no review ever answers a superseded request); the
 * next review of that login answers the open request; a review with no open
 * request answers nothing. What remains open at the end is in flight.
 */

/** A review request or a submitted review: its instant and the reviewer's login. */
export interface ReviewerEvent {
  readonly at: string;
  readonly login: string;
}

type RoundOutcome = 'reviewed' | 'superseded' | 'in-flight';

export interface ReviewRound {
  readonly login: string;
  readonly requestedAt: string;
  readonly reviewedAt: string | undefined;
  /** Request to review, minutes to one decimal; absent unless reviewed. */
  readonly minutes: number | undefined;
  readonly outcome: RoundOutcome;
}

interface SweepEvent {
  readonly kind: 'request' | 'review';
  readonly at: string;
  readonly index: number;
  readonly login: string;
}

interface RoundState {
  readonly reviewedBy: Map<number, ReviewerEvent>;
  readonly superseded: Set<number>;
  /** The open request per lower-cased login: requested, not yet answered, not yet superseded. */
  readonly open: Map<string, number>;
}

function sweepEvents(
  requests: readonly ReviewerEvent[],
  reviews: readonly ReviewerEvent[],
): readonly SweepEvent[] {
  const of = (kind: SweepEvent['kind'], events: readonly ReviewerEvent[]): SweepEvent[] =>
    events.map((event, index) => ({ kind, at: event.at, index, login: event.login.toLowerCase() }));
  return [...of('request', requests), ...of('review', reviews)].sort(
    (a, b) => Date.parse(a.at) - Date.parse(b.at),
  );
}

function applyRequest(state: RoundState, event: SweepEvent): void {
  const openIndex = state.open.get(event.login);
  if (openIndex !== undefined) {
    state.superseded.add(openIndex);
  }
  state.open.set(event.login, event.index);
}

function applyReview(state: RoundState, event: SweepEvent, review: ReviewerEvent): void {
  const openIndex = state.open.get(event.login);
  if (openIndex !== undefined) {
    state.reviewedBy.set(openIndex, review);
    state.open.delete(event.login);
  }
}

function sweep(requests: readonly ReviewerEvent[], reviews: readonly ReviewerEvent[]): RoundState {
  const state: RoundState = { reviewedBy: new Map(), superseded: new Set(), open: new Map() };
  for (const event of sweepEvents(requests, reviews)) {
    const review = reviews[event.index];
    if (event.kind === 'request') {
      applyRequest(state, event);
    } else if (review !== undefined) {
      applyReview(state, event, review);
    }
  }
  return state;
}

function roundOf(request: ReviewerEvent, index: number, state: RoundState): ReviewRound {
  const review = state.reviewedBy.get(index);
  if (review !== undefined) {
    return {
      login: request.login,
      requestedAt: request.at,
      reviewedAt: review.at,
      minutes: minutesBetween(request.at, review.at),
      outcome: 'reviewed',
    };
  }
  return {
    login: request.login,
    requestedAt: request.at,
    reviewedAt: undefined,
    minutes: undefined,
    outcome: state.superseded.has(index) ? 'superseded' : 'in-flight',
  };
}

/** Each request's outcome, in request order. */
export function pairRounds(
  requests: readonly ReviewerEvent[],
  reviews: readonly ReviewerEvent[],
): readonly ReviewRound[] {
  const state = sweep(requests, reviews);
  return requests.map((request, index) => roundOf(request, index, state));
}
