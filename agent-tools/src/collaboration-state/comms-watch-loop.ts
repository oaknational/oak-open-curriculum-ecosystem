import {
  emitWatcherError,
  reportTimeout,
  runWithDeadline,
  WatcherTimeoutError,
  type WatcherErrorKind,
} from './comms-watch-errors.js';
import { type DrainResult } from './types.js';

export { WatcherTimeoutError, type WatcherErrorKind } from './comms-watch-errors.js';

/**
 * Watch loop: drain, emit, markSeen (in that order), then wait. The drain
 * function MUST return event IDs in `result.eventIds`; this function marks
 * them seen only AFTER emit succeeds, so a crash between drain and emit
 * produces a duplicate notification next cycle rather than a missed
 * notification.
 *
 * Per-step errors are caught and surfaced via the emit channel as
 * `--- WATCHER ERROR --- kind=<step> message=<message> [event_ids=...] ---`
 * lines; the loop continues unless `onError` returns true (fatal).
 *
 * The optional `tick` callback fires on every loop iteration (before the
 * wait step). It is used by the heartbeat surface to write liveness state
 * without polluting the event stream. Errors thrown by `tick` are swallowed
 * to keep the watcher alive — heartbeat failure must not kill the watch.
 *
 * See FM-2 cure (2026-05-23): Monitor-harness liveness investigation.
 */
export async function watchCommsLoop(input: WatchCommsLoopInput): Promise<string> {
  const state: LoopState = {
    emitted: 0,
    output: '',
    lastDrainAt: null,
    lastEmitAt: null,
    lastErrorAt: null,
  };

  try {
    while (needsMoreEvents(state.emitted, input.maxEvents)) {
      const continued = await runOneIteration(input, state);
      if (!continued) {
        return state.output;
      }
    }
  } catch (error) {
    if (error instanceof WatcherTimeoutError) {
      state.lastErrorAt = nowIso();
      await reportTimeout(input.emit, error, input.stepTimeoutMs);
    }
    // Re-throw so the failure propagates to a non-zero process exit: a
    // timed-out step is fatal and must be visible to the supervisor.
    throw error;
  }

  return state.output;
}

export interface WatchCommsLoopInput {
  readonly maxEvents?: number;
  readonly drain: (remainingEvents?: number) => Promise<DrainResult>;
  readonly waitForChange: () => Promise<void>;
  readonly emit: (text: string) => Promise<void>;
  readonly markSeen: (eventIds: readonly string[]) => Promise<void>;
  readonly tick?: (status: WatcherTickStatus) => Promise<void>;
  readonly onError?: (kind: WatcherErrorKind, error: unknown) => Promise<boolean>;
  /**
   * Per-step deadline in milliseconds, applied to the `drain`, `emit`, and
   * `markSeen` awaits (NOT `waitForChange`, which is already poll-bounded by
   * construction). A step that exceeds the deadline is the hang-but-run
   * failure mode (2026-06-10): the loop emits a `kind=timeout` WATCHER ERROR
   * line naming the step and then REJECTS — a timed-out step is always fatal,
   * so the supervising Monitor/cron sees a non-zero exit it can surface and
   * restart, rather than a silently muted watcher. When `undefined`, no
   * deadline is applied (a hung step is awaited forever — the legacy shape).
   */
  readonly stepTimeoutMs?: number;
}

export interface WatcherTickStatus {
  readonly lastDrainAt: string | null;
  readonly lastEmitAt: string | null;
  readonly lastErrorAt: string | null;
  readonly emittedCount: number;
}

interface LoopState {
  emitted: number;
  output: string;
  lastDrainAt: string | null;
  lastEmitAt: string | null;
  lastErrorAt: string | null;
}

type StepResult<TValue> =
  | { readonly status: 'ok'; readonly value: TValue }
  | { readonly status: 'error'; readonly kind: WatcherErrorKind; readonly error: unknown };

async function runOneIteration(input: WatchCommsLoopInput, state: LoopState): Promise<boolean> {
  const drainOutcome = await runStep(
    'drain',
    () => input.drain(remainingEvents(state.emitted, input.maxEvents)),
    input.stepTimeoutMs,
  );
  if (drainOutcome.status === 'error') {
    return await handleStepError(input, state, drainOutcome);
  }

  state.lastDrainAt = nowIso();

  const result = drainOutcome.value;
  if (result.output !== '') {
    const emitted = await emitAndMark(input, state, result);
    if (!emitted) {
      return true;
    }
  }

  await runTick(input.tick, snapshotStatus(state));
  if (needsMoreEvents(state.emitted, input.maxEvents)) {
    await input.waitForChange();
  }
  return true;
}

async function emitAndMark(
  input: WatchCommsLoopInput,
  state: LoopState,
  result: DrainResult,
): Promise<boolean> {
  const emitOutcome = await runStep('emit', () => input.emit(result.output), input.stepTimeoutMs);
  if (emitOutcome.status === 'error') {
    const cont = await handleStepError(input, state, emitOutcome);
    // events stay unseen — next iteration will re-emit them.
    return cont;
  }
  state.lastEmitAt = nowIso();
  state.output += result.output;
  state.emitted += result.eventCount;

  const markOutcome = await runStep(
    'markSeen',
    () => input.markSeen(result.eventIds),
    input.stepTimeoutMs,
  );
  if (markOutcome.status === 'error') {
    state.lastErrorAt = nowIso();
    await emitWatcherError(input.emit, markOutcome.kind, markOutcome.error, result.eventIds);
    const fatal = await runFatalDecision(input.onError, markOutcome.kind, markOutcome.error);
    if (fatal) {
      return false;
    }
    // Duplicate emit on next cycle is safe; continue.
  }
  return true;
}

async function handleStepError(
  input: WatchCommsLoopInput,
  state: LoopState,
  outcome: StepResult<unknown> & { status: 'error' },
): Promise<boolean> {
  state.lastErrorAt = nowIso();
  await emitWatcherError(input.emit, outcome.kind, outcome.error);
  const fatal = await runFatalDecision(input.onError, outcome.kind, outcome.error);
  if (fatal) {
    return false;
  }
  await runTick(input.tick, snapshotStatus(state));
  if (needsMoreEvents(state.emitted, input.maxEvents)) {
    await input.waitForChange();
  }
  return true;
}

async function runStep<TValue>(
  kind: WatcherErrorKind,
  fn: () => Promise<TValue>,
  timeoutMs: number | undefined,
): Promise<StepResult<TValue>> {
  try {
    const value = timeoutMs === undefined ? await fn() : await runWithDeadline(kind, fn, timeoutMs);
    return { status: 'ok', value };
  } catch (error) {
    if (error instanceof WatcherTimeoutError) {
      // A timed-out step is fatal-by-construction: propagate, never demote
      // it to a recoverable StepResult error or route it through onError.
      throw error;
    }
    return { status: 'error', kind, error };
  }
}

async function runFatalDecision(
  onError: ((kind: WatcherErrorKind, error: unknown) => Promise<boolean>) | undefined,
  kind: WatcherErrorKind,
  error: unknown,
): Promise<boolean> {
  if (onError === undefined) {
    return false;
  }
  try {
    return await onError(kind, error);
  } catch {
    return false;
  }
}

async function runTick(
  tick: ((status: WatcherTickStatus) => Promise<void>) | undefined,
  status: WatcherTickStatus,
): Promise<void> {
  if (tick === undefined) {
    return;
  }
  try {
    await tick(status);
  } catch {
    // Heartbeat failures must not kill the watcher.
  }
}

function snapshotStatus(state: LoopState): WatcherTickStatus {
  return {
    lastDrainAt: state.lastDrainAt,
    lastEmitAt: state.lastEmitAt,
    lastErrorAt: state.lastErrorAt,
    emittedCount: state.emitted,
  };
}

function needsMoreEvents(emitted: number, maxEvents: number | undefined): boolean {
  return maxEvents === undefined || emitted < maxEvents;
}

function remainingEvents(emitted: number, maxEvents: number | undefined): number | undefined {
  return maxEvents === undefined ? undefined : maxEvents - emitted;
}

function nowIso(): string {
  return new Date().toISOString();
}
