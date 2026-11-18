/**
 * When a Codex seat's wake companion may queue its fixed notice, and what a
 * pass writes and marks once it has tried. Pure: time and the seat's last
 * ack are inputs, never read here. The bounds follow mechanism 7 of the
 * plan node `codex-queue-wake-bridge`: one notice outstanding until the
 * seat acknowledges it, a capped number unacknowledged, a budget in any
 * rolling hour, and a capped backoff after a failed call.
 *
 * @packageDocumentation
 */
import { isLowercaseUuid } from '../core/lowercase-uuid.js';

/** How long an unacknowledged notice holds the next one back. */
export const WAKE_RELEASE_INTERVAL_MS = 10 * 60 * 1000;

/** How many notices may go unacknowledged before queueing stops. */
export const WAKE_MAX_UNACKNOWLEDGED = 2;

/** How many notices may be queued in any rolling window. */
export const WAKE_BUDGET = 4;

/** The rolling window the budget counts over. */
export const WAKE_BUDGET_WINDOW_MS = 60 * 60 * 1000;

/** The wait after one failed queue call; it doubles with each failure in a row. */
export const WAKE_BACKOFF_BASE_MS = 30 * 1000;

/** The longest wait after failed queue calls, however many come in a row. */
export const WAKE_BACKOFF_CAP_MS = 10 * 60 * 1000;

/**
 * How far ahead of now an ack's time may be and still count, for clocks and
 * file times that disagree by a moment. An ack dated later is ignored, so a
 * file time set in the future cannot release every later notice.
 */
export const WAKE_ACK_SKEW_MS = 5 * 1000;

/** The most event ids one line names; the rest are counted. */
export const WAKE_LINE_MAX_IDS = 5;

/** Why queueing has stopped until the seat acknowledges or the window rolls. */
type WakeStopReason = 'unacknowledged' | 'budget';

/**
 * Why a queue call failed, in the companion's own terms, never the call's
 * output:
 * - `timeout`: the call ran past its deadline and was killed;
 * - `exit-non-zero`: `codex queue` ran and exited non-zero;
 * - `not-found`: no `codex` binary was found to run;
 * - `spawn-failed`: the process could not be started.
 *
 * The first two may still have delivered the notice, so they count against
 * the budget; the last two prove nothing was delivered.
 */
type QueueFailure = 'timeout' | 'exit-non-zero' | 'not-found' | 'spawn-failed';

/**
 * What the companion remembers between passes. It holds times and counts
 * only, never an event's text.
 */
export interface WakeState {
  /** When each notice inside the budget window was queued, oldest first. */
  readonly queuedAt: readonly number[];
  /** When the latest notice was queued, if any has been. */
  readonly lastQueuedAt: number | undefined;
  /** Notices queued since the seat last acknowledged one. */
  readonly unacknowledged: number;
  /** Queue calls failed in a row. */
  readonly failures: number;
  /** When the latest of those failures happened. */
  readonly lastFailureAt: number | undefined;
  /** The stop last reported, so it is reported once. */
  readonly stopped: WakeStopReason | undefined;
}

/** The state of a companion that has queued nothing yet. */
export const INITIAL_WAKE_STATE: WakeState = {
  queuedAt: [],
  lastQueuedAt: undefined,
  unacknowledged: 0,
  failures: 0,
  lastFailureAt: undefined,
  stopped: undefined,
};

/** What a pass does: nothing, queue a notice, hold one back, or stop queueing. */
type WakeDecision =
  | { readonly kind: 'idle' }
  | { readonly kind: 'queue' }
  | { readonly kind: 'hold'; readonly reason: 'outstanding' | 'backoff' }
  | { readonly kind: 'stop'; readonly reason: WakeStopReason };

/** How a pass ended: a decision other than queueing, or the queue call's outcome. */
type WakeStep =
  | Exclude<WakeDecision, { readonly kind: 'queue' }>
  | { readonly kind: 'queued' }
  | { readonly kind: 'failed'; readonly reason: QueueFailure };

/**
 * Decide what a pass does with the events that wake the seat. An ack after
 * the latest notice, and not dated after now, clears the count of
 * unacknowledged notices first, and notices older than the budget window
 * stop counting against it. Settle the pass with the state this returns.
 *
 * @param input - The state, the pass's waking events, the time now, and
 * when the seat last acknowledged a wake, if it has.
 */
export function decideWake(input: {
  readonly state: WakeState;
  readonly wake: readonly string[];
  readonly now: number;
  readonly lastAckAt: number | undefined;
}): { readonly decision: WakeDecision; readonly state: WakeState } {
  const state = withinWindow(acknowledged(input.state, input.lastAckAt, input.now), input.now);
  return { decision: decision(state, input.wake, input.now), state };
}

function decision(state: WakeState, wake: readonly string[], now: number): WakeDecision {
  if (wake.length === 0) {
    return { kind: 'idle' };
  }
  if (inBackoff(state, now)) {
    return { kind: 'hold', reason: 'backoff' };
  }
  if (state.unacknowledged >= WAKE_MAX_UNACKNOWLEDGED) {
    return { kind: 'stop', reason: 'unacknowledged' };
  }
  if (state.queuedAt.length >= WAKE_BUDGET) {
    return { kind: 'stop', reason: 'budget' };
  }
  return outstanding(state, now) ? { kind: 'hold', reason: 'outstanding' } : { kind: 'queue' };
}

function inBackoff(state: WakeState, now: number): boolean {
  return state.lastFailureAt !== undefined && now < state.lastFailureAt + backoff(state.failures);
}

/** An unacknowledged notice still inside its release interval. */
function outstanding(state: WakeState, now: number): boolean {
  return (
    state.unacknowledged > 0 &&
    state.lastQueuedAt !== undefined &&
    now < state.lastQueuedAt + WAKE_RELEASE_INTERVAL_MS
  );
}

function acknowledged(state: WakeState, lastAckAt: number | undefined, now: number): WakeState {
  if (lastAckAt === undefined || state.lastQueuedAt === undefined) {
    return state;
  }
  if (lastAckAt <= state.lastQueuedAt || lastAckAt > now + WAKE_ACK_SKEW_MS) {
    return state;
  }
  return { ...state, unacknowledged: 0 };
}

function withinWindow(state: WakeState, now: number): WakeState {
  const queuedAt = state.queuedAt.filter((at) => now < at + WAKE_BUDGET_WINDOW_MS);
  return queuedAt.length === state.queuedAt.length ? state : { ...state, queuedAt };
}

function backoff(failures: number): number {
  return Math.min(WAKE_BACKOFF_BASE_MS * 2 ** Math.max(failures - 1, 0), WAKE_BACKOFF_CAP_MS);
}

/**
 * What a pass writes and marks once it has decided, and queued if it
 * decided to. A queued notice marks its waking events and writes one line,
 * since the watch loop marks events only for a pass with output. A failed
 * call writes one WAKE FAILED line and marks nothing, so the events are
 * examined again after the backoff. A stop writes its line once.
 *
 * @param input - The state after the decision, the pass's waking events,
 * the time now, and how the pass ended.
 */
export function settleWake(input: {
  readonly state: WakeState;
  readonly wake: readonly string[];
  readonly now: number;
  readonly step: WakeStep;
}): {
  readonly lines: readonly string[];
  readonly marked: readonly string[];
  readonly state: WakeState;
} {
  const { state, wake, now, step } = input;
  if (step.kind === 'queued') {
    return {
      lines: [`WAKE QUEUED for ${named(wake)}.`],
      marked: wake,
      state: {
        queuedAt: [...state.queuedAt, now],
        lastQueuedAt: now,
        unacknowledged: state.unacknowledged + 1,
        failures: 0,
        lastFailureAt: undefined,
        stopped: undefined,
      },
    };
  }
  if (step.kind === 'failed') {
    return {
      lines: [
        `WAKE FAILED (${step.reason}, attempt ${state.failures + 1}) for ${named(wake)}. ` +
          'No delivery is claimed; the wake is retried after its backoff. ' +
          'Fallback: bounded foreground polling.',
      ],
      marked: [],
      state: {
        ...state,
        queuedAt: mayHaveDelivered(step.reason) ? [...state.queuedAt, now] : state.queuedAt,
        failures: state.failures + 1,
        lastFailureAt: now,
      },
    };
  }
  if (step.kind === 'stop' && state.stopped !== step.reason) {
    return {
      lines: [stopLine(step.reason)],
      marked: [],
      state: { ...state, stopped: step.reason },
    };
  }
  return { lines: [], marked: [], state };
}

function stopLine(reason: WakeStopReason): string {
  const cause =
    reason === 'unacknowledged'
      ? `${WAKE_MAX_UNACKNOWLEDGED} notices are unacknowledged; queueing resumes after the seat acknowledges`
      : `the budget of ${WAKE_BUDGET} notices an hour is spent; queueing resumes as the hour rolls`;
  return `WAKE STOPPED: ${cause}. Fallback: bounded foreground polling.`;
}

/** A failed call that may still have queued the notice, which the budget must count. */
function mayHaveDelivered(reason: QueueFailure): boolean {
  return reason === 'timeout' || reason === 'exit-non-zero';
}

/**
 * Name the events for a line: an event id is peer-written, so only a UUID is
 * named. At most {@link WAKE_LINE_MAX_IDS} are named, and the rest counted.
 */
function named(ids: readonly string[]): string {
  const shown = ids
    .slice(0, WAKE_LINE_MAX_IDS)
    .map((id) => (isLowercaseUuid(id) ? id : '<an id that is not a UUID>'));
  const rest = ids.length - shown.length;
  return rest > 0 ? `${shown.join(', ')} and ${rest} more` : shown.join(', ');
}
