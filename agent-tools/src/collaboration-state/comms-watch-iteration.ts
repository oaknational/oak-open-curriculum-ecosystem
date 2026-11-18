/**
 * One drain-to-wait pass of the comms watch, and the per-step outcome
 * ruling that governs it. The loop (`comms-watch-loop.ts`) owns LIFECYCLE —
 * start state, the supervisor probe, the orderly-exit lines, fatal-timeout
 * propagation; this module owns the PASS — step sequencing (drain → mark
 * excluded → emit → markSeen → tick → wait) and how a failed step is
 * reported and ruled fatal or recoverable. The loop-input contract
 * (`WatchCommsLoopInput`) and the per-process `LoopState` live here because
 * the pass is their primary reader and sole writer; the loop re-exports
 * them as its public surface.
 *
 * @packageDocumentation
 */
import { emitWatcherError, type WatcherErrorKind } from './comms-watch-errors.js';
import { runFatalDecision, runStep, runTick, type WatcherTickStatus } from './comms-watch-steps.js';
import { type DrainResult } from './types.js';

export interface WatchCommsLoopInput {
  /**
   * Per-pass drain-batch bound: caps how many events ONE drain pass may
   * emit, so every successful pass advances the seen-file cursor (an
   * emit-failure pass deliberately leaves its events unseen for
   * redelivery). Never a lifetime budget — the loop's lifetime is bounded
   * only by supervisor death, a fatal step, or a step deadline; and the
   * bound caps the batch EMITTED, not the unseen-set read that finds it.
   * `undefined` leaves each pass unbounded, which re-creates the
   * 2026-07-23 drain-deadline wedge on a large unseen backlog — production
   * invocations always pass a bound.
   */
  readonly maxEventsPerDrain?: number;
  readonly drain: (batchLimit?: number) => Promise<DrainResult>;
  /**
   * Wait before the next pass. MUST NOT reject: the loop runs it outside
   * the per-step deadline machinery, so a rejection escapes as an
   * unclassified fatal exit — no WATCHER ERROR line, no WATCHER EXIT line.
   * The production implementation is a plain timer that resolves after one
   * `pollMs` interval (the watcher waits one `pollMs` interval between
   * passes) and never rejects.
   */
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
  /** Optional supervisor-liveness probe (F-101 kill-tree); see `watcher-supervisor.ts`. */
  readonly supervisorAlive?: () => boolean | Promise<boolean>;
}

/** Mutable per-process watch state; `emitted` is monotonic (heartbeat contract). */
export interface LoopState {
  emitted: number;
  lastDrainAt: string | null;
  lastEmitAt: string | null;
  lastErrorAt: string | null;
}

/** The loop's start state: nothing drained, nothing emitted, no errors. */
export function initialLoopState(): LoopState {
  return {
    emitted: 0,
    lastDrainAt: null,
    lastEmitAt: null,
    lastErrorAt: null,
  };
}

/** The heartbeat tick's read-only view of {@link LoopState}. */
function snapshotStatus(state: LoopState): WatcherTickStatus {
  return {
    lastDrainAt: state.lastDrainAt,
    lastEmitAt: state.lastEmitAt,
    lastErrorAt: state.lastErrorAt,
    emittedCount: state.emitted,
  };
}

/**
 * One drain-to-wait pass. Returns false only when `onError` ruled a step
 * failure fatal — the loop then emits the `reason=fatal-step` EXIT line and
 * returns. Every non-fatal pass — including passes whose steps failed
 * recoverably — ends with exactly one tick and one wait, so the heartbeat
 * cadence and the backlog pacing hold on every path.
 */
export async function runOneIteration(
  input: WatchCommsLoopInput,
  state: LoopState,
): Promise<boolean> {
  const drainOutcome = await runStep(
    'drain',
    () => input.drain(input.maxEventsPerDrain),
    input.stepTimeoutMs,
  );
  if (drainOutcome.status === 'error') {
    if (await stepErrorRuledFatal(input, state, drainOutcome.kind, drainOutcome.error)) {
      return false;
    }
  } else {
    state.lastDrainAt = nowIso();
    const result = drainOutcome.value;
    if (await markExcludedRuledFatal(input, state, result)) {
      return false;
    }
    if (result.output !== '' && (await emitAndMarkRuledFatal(input, state, result))) {
      return false;
    }
  }

  await runTick(input.tick, snapshotStatus(state));
  await input.waitForChange();
  return true;
}

/**
 * Report a failed step and decide fatality: emit the WATCHER ERROR line,
 * then return `onError`'s ruling (absent hook → never fatal). The caller
 * exits the loop on true; on false the iteration completes normally.
 */
async function stepErrorRuledFatal(
  input: WatchCommsLoopInput,
  state: LoopState,
  kind: WatcherErrorKind,
  error: unknown,
  eventIds?: readonly string[],
): Promise<boolean> {
  state.lastErrorAt = nowIso();
  await emitWatcherError(input.emit, kind, error, eventIds);
  return runFatalDecision(input.onError, kind, error);
}

/**
 * Mark F-146-excluded ids seen, independent of emit — they carry no
 * emission debt, and skipping them on empty-output drains would re-grow the
 * unseen backlog every pass and replay it when the filter lifts. Returns
 * true only when `onError` ruled the marking failure fatal (duplicate
 * marking next cycle is safe, so failures default to non-fatal).
 */
async function markExcludedRuledFatal(
  input: WatchCommsLoopInput,
  state: LoopState,
  result: DrainResult,
): Promise<boolean> {
  const excluded = result.excludedEventIds;
  if (excluded === undefined || excluded.length === 0) {
    return false;
  }
  const markOutcome = await runStep(
    'markSeen',
    () => input.markSeen(excluded),
    input.stepTimeoutMs,
  );
  if (markOutcome.status === 'error') {
    return stepErrorRuledFatal(input, state, markOutcome.kind, markOutcome.error, excluded);
  }
  return false;
}

/**
 * Emit the drained output, then mark its events seen. An emit failure
 * leaves the events unseen — the next pass re-drains and re-emits them; a
 * markSeen failure after a successful emit reports the owed event_ids
 * (duplicate emission next cycle is safe). Returns true only when `onError`
 * ruled the failure fatal.
 */
async function emitAndMarkRuledFatal(
  input: WatchCommsLoopInput,
  state: LoopState,
  result: DrainResult,
): Promise<boolean> {
  const emitOutcome = await runStep('emit', () => input.emit(result.output), input.stepTimeoutMs);
  if (emitOutcome.status === 'error') {
    return stepErrorRuledFatal(input, state, emitOutcome.kind, emitOutcome.error);
  }
  state.lastEmitAt = nowIso();
  state.emitted += result.eventCount;

  const markOutcome = await runStep(
    'markSeen',
    () => input.markSeen(result.eventIds),
    input.stepTimeoutMs,
  );
  if (markOutcome.status === 'error') {
    return stepErrorRuledFatal(input, state, markOutcome.kind, markOutcome.error, result.eventIds);
  }
  return false;
}

function nowIso(): string {
  return new Date().toISOString();
}
