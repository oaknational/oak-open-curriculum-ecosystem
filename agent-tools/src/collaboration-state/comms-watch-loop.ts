import { type DrainResult } from './types.js';

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

  while (needsMoreEvents(state.emitted, input.maxEvents)) {
    const continued = await runOneIteration(input, state);
    if (!continued) {
      return state.output;
    }
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
}

export type WatcherErrorKind = 'drain' | 'emit' | 'markSeen';

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
  const drainOutcome = await runStep('drain', () =>
    input.drain(remainingEvents(state.emitted, input.maxEvents)),
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
  const emitOutcome = await runStep('emit', () => input.emit(result.output));
  if (emitOutcome.status === 'error') {
    const cont = await handleStepError(input, state, emitOutcome);
    // events stay unseen — next iteration will re-emit them.
    return cont;
  }
  state.lastEmitAt = nowIso();
  state.output += result.output;
  state.emitted += result.eventCount;

  const markOutcome = await runStep('markSeen', () => input.markSeen(result.eventIds));
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
): Promise<StepResult<TValue>> {
  try {
    return { status: 'ok', value: await fn() };
  } catch (error) {
    return { status: 'error', kind, error };
  }
}

async function emitWatcherError(
  emit: (text: string) => Promise<void>,
  kind: WatcherErrorKind,
  error: unknown,
  eventIds?: readonly string[],
): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  const idsSuffix =
    eventIds !== undefined && eventIds.length > 0 ? ` event_ids=${eventIds.join(',')}` : '';
  const text = `--- WATCHER ERROR --- kind=${kind} message=${message}${idsSuffix}\n`;
  try {
    await emit(text);
  } catch {
    // Emit-failure during error reporting is intentionally swallowed —
    // the watch loop must not die because its own error-reporting failed.
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
