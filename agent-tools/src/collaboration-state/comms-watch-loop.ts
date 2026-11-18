import { emitWatcherExit, reportTimeout, WatcherTimeoutError } from './comms-watch-errors.js';
import {
  initialLoopState,
  runOneIteration,
  type WatchCommsLoopInput,
} from './comms-watch-iteration.js';
import { supervisorIsGone } from './watcher-supervisor.js';

export { type WatcherTickStatus } from './comms-watch-steps.js';
export { type WatchCommsLoopInput } from './comms-watch-iteration.js';
export { WatcherTimeoutError, type WatcherErrorKind } from './comms-watch-errors.js';

/**
 * Watch-loop LIFECYCLE: start state, the top-of-iteration supervisor probe,
 * the orderly-exit lines, and fatal-timeout propagation. The pass itself —
 * drain, mark excluded, emit, markSeen (in that order), then tick and
 * wait — lives in `comms-watch-iteration.ts` and runs forever under this
 * lifecycle. `maxEventsPerDrain` bounds each individual drain pass (so
 * EVERY pass advances the seen-file cursor) and never the loop's lifetime:
 * the watcher runs until its supervisor dies, a step is ruled fatal, or a
 * step deadline fires. The watcher waits one `pollMs` interval between
 * passes, so it paces a backlog dump and live traffic alike to at most
 * `maxEventsPerDrain` events per pass, and every emission stays chunked to
 * one bounded batch.
 *
 * The drain function MUST return event IDs in `result.eventIds`; the pass
 * marks them seen only AFTER emit succeeds, so a crash between drain and
 * emit produces a duplicate notification next cycle rather than a missed
 * notification. Ids in `result.excludedEventIds` (the sanctioned F-146 tag
 * exclusion) carry no emission debt and are marked seen UNCONDITIONALLY
 * after a successful drain — including drains whose output is empty — so an
 * excluded backlog never accumulates or replays; excluded events never
 * count toward `emitted_count`.
 *
 * Exit contract: every ORDERLY exit emits a final
 * `--- WATCHER EXIT --- reason=<reason> emitted_count=<n>` line
 * (`supervisor-gone`, or `fatal-step` after the failed step's own WATCHER
 * ERROR line) and resolves. A timed-out step REJECTS after its
 * `kind=timeout` WATCHER ERROR line, with no EXIT line — a disorderly death
 * is visible as a non-zero process exit, never as a quiet stream end.
 * Recoverable per-step errors surface as
 * `--- WATCHER ERROR --- kind=<step> message=<message> [event_ids=...]`
 * lines and the loop continues unless `onError` returns true (fatal).
 *
 * The optional `tick` callback fires at the end of every non-fatal
 * iteration (before the wait). It is used by the heartbeat surface to write
 * liveness state without polluting the event stream; errors thrown by
 * `tick` are swallowed to keep the watcher alive — heartbeat failure must
 * not kill the watch.
 *
 * See FM-2 cure (2026-05-23) and the per-pass semantics ruling (MCP-229).
 */
export async function watchCommsLoop(input: WatchCommsLoopInput): Promise<void> {
  const state = initialLoopState();

  try {
    for (;;) {
      if (await supervisorIsGone(input.supervisorAlive)) {
        await emitWatcherExit(input.emit, 'supervisor-gone', state.emitted);
        return;
      }
      const continued = await runOneIteration(input, state);
      if (!continued) {
        await emitWatcherExit(input.emit, 'fatal-step', state.emitted);
        return;
      }
    }
  } catch (error) {
    if (error instanceof WatcherTimeoutError) {
      state.lastErrorAt = new Date().toISOString();
      await reportTimeout(input.emit, error, input.stepTimeoutMs);
    }
    // Re-throw so the failure propagates to a non-zero process exit: a
    // timed-out step is fatal and must be visible to the supervisor.
    throw error;
  }
}
