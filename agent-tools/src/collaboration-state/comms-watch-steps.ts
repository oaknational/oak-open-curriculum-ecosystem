/**
 * Per-step execution helpers for the comms watch loop: deadline-bounded step
 * running, the fatal-decision hook, and the swallowed-failure tick runner.
 * Extracted from `comms-watch-loop.ts`; the loop owns sequencing, this module
 * owns how a single step runs and fails.
 *
 * @packageDocumentation
 */
import {
  runWithDeadline,
  WatcherTimeoutError,
  type WatcherErrorKind,
} from './comms-watch-errors.js';
/** Per-iteration liveness snapshot passed to the heartbeat tick. */
export interface WatcherTickStatus {
  readonly lastDrainAt: string | null;
  readonly lastEmitAt: string | null;
  readonly lastErrorAt: string | null;
  readonly emittedCount: number;
}

export type StepResult<TValue> =
  | { readonly status: 'ok'; readonly value: TValue }
  | { readonly status: 'error'; readonly kind: WatcherErrorKind; readonly error: unknown };

export async function runStep<TValue>(
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

export async function runFatalDecision(
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

export async function runTick(
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
