/**
 * Watcher error taxonomy, the per-step deadline that converts a hung await
 * into a surfaced failure, and the WATCHER ERROR diagnostic-line emitters.
 *
 * Separated from the orchestration loop (`comms-watch-loop.ts`) so the loop
 * stays a readable state machine while the failure-surfacing concern — the
 * cure for the 2026-06-10 hang-but-run incident — lives as one cohesive unit.
 */

export type WatcherErrorKind = 'drain' | 'emit' | 'markSeen';

/**
 * Thrown when a watch-loop step exceeds its per-step deadline. Carries the
 * step name in `message` so the `kind=timeout` WATCHER ERROR line identifies
 * which await hung. Always fatal — never converted to a recoverable step
 * result and never routed through the loop's `onError` hook.
 */
export class WatcherTimeoutError extends Error {
  readonly step: WatcherErrorKind;

  constructor(step: WatcherErrorKind, timeoutMs: number) {
    super(`step "${step}" exceeded ${timeoutMs}ms deadline`);
    this.name = 'WatcherTimeoutError';
    this.step = step;
  }
}

/**
 * Race a step against its deadline. Resolves/rejects with the step's own
 * outcome if it settles first; rejects with a {@link WatcherTimeoutError}
 * (naming the step) if the deadline fires first. The timer is cleared on
 * settle so a fast step leaves no dangling timer.
 */
export function runWithDeadline<TValue>(
  step: WatcherErrorKind,
  fn: () => Promise<TValue>,
  timeoutMs: number,
): Promise<TValue> {
  return new Promise<TValue>((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      reject(new WatcherTimeoutError(step, timeoutMs));
    }, timeoutMs);

    fn().then(
      (value) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
    );
  });
}

/**
 * Best-effort emit of the `kind=timeout` WATCHER ERROR line. Bounded by the
 * same per-step deadline so it cannot itself wedge on a hung emit channel —
 * the prime suspect for the original hang. Any failure (including a second
 * timeout) is swallowed: the re-thrown {@link WatcherTimeoutError} and the
 * non-zero exit it produces are the real fail-loud signal.
 *
 * When the hung step IS `emit`, this report's own emit also wedges and is
 * cut off by its deadline, so worst-case process-exit latency is
 * `2 * stepTimeoutMs` (one deadline for the hung step, one for the report).
 */
export async function reportTimeout(
  emit: (text: string) => Promise<void>,
  error: WatcherTimeoutError,
  timeoutMs: number | undefined,
): Promise<void> {
  const text = `--- WATCHER ERROR --- kind=timeout message=${error.message}\n`;
  try {
    if (timeoutMs === undefined) {
      await emit(text);
    } else {
      // Bound the report's own emit against the same deadline (it is itself an
      // emit). The `kind=timeout` classification above is a literal in the
      // output line, not a step kind.
      await runWithDeadline('emit', () => emit(text), timeoutMs);
    }
  } catch {
    // Swallow — fail-loud is carried by the re-thrown error / non-zero exit.
  }
}

/**
 * Emit a `--- WATCHER ERROR --- kind=<step> message=<message> [event_ids=...]`
 * line for a recoverable step failure. Emit-failure during this report is
 * intentionally swallowed — the watch loop must not die because its own
 * error reporting failed.
 */
export async function emitWatcherError(
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
    // Emit-failure during error reporting is intentionally swallowed.
  }
}
