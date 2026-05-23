import { type CollaborationTuiSnapshot } from './snapshot.js';

/**
 * Settled state of the collaboration TUI refresh subsystem.
 *
 * The state is fully determined by the sequence of {@link RefreshEvent}s the
 * component has observed. Stale events (results of an attempt other than the
 * latest one started) are discarded by {@link reduceRefreshState} so that
 * out-of-order promise settlements cannot resurrect older snapshots or error
 * messages.
 */
export interface RefreshState {
  readonly snapshot: CollaborationTuiSnapshot;
  readonly status: string;
  readonly latestAttemptId: number;
}

/**
 * Discriminated union of events that can update {@link RefreshState}.
 *
 * Each event carries the `attemptId` of the refresh it belongs to. The
 * reducer uses `attemptId === latestAttemptId` to decide whether a settled
 * result is current or stale.
 */
export type RefreshEvent =
  | { readonly kind: 'refresh-started'; readonly attemptId: number }
  | {
      readonly kind: 'refresh-succeeded';
      readonly attemptId: number;
      readonly snapshot: CollaborationTuiSnapshot;
    }
  | {
      readonly kind: 'refresh-failed';
      readonly attemptId: number;
      readonly error: Error;
    };

/**
 * Initial state for a TUI rendering the given snapshot, with no refresh
 * attempts yet started.
 */
export function initialRefreshState(snapshot: CollaborationTuiSnapshot): RefreshState {
  return { snapshot, status: 'ready', latestAttemptId: 0 };
}

/**
 * Pure reducer for the refresh subsystem.
 *
 * Invariant: only the settlement of the latest started attempt is allowed to
 * change `snapshot` or `status`. Older settlements (whether success or
 * failure) are discarded. This is the discrimination logic that makes
 * concurrent refreshes order-independent: the user always sees the result of
 * the most recent attempt, never a flash of an older one.
 */
export function reduceRefreshState(state: RefreshState, event: RefreshEvent): RefreshState {
  switch (event.kind) {
    case 'refresh-started':
      return event.attemptId > state.latestAttemptId
        ? { ...state, status: 'refreshing', latestAttemptId: event.attemptId }
        : state;
    case 'refresh-succeeded':
      return event.attemptId === state.latestAttemptId
        ? {
            ...state,
            snapshot: event.snapshot,
            status: `refreshed ${event.snapshot.generated_at}`,
          }
        : state;
    case 'refresh-failed':
      return event.attemptId === state.latestAttemptId
        ? { ...state, status: event.error.message }
        : state;
    default:
      return assertExhaustive(event);
  }
}

function assertExhaustive(event: never): never {
  throw new Error(`reduceRefreshState received an unhandled event kind: ${JSON.stringify(event)}`);
}
