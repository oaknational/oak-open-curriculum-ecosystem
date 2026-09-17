/**
 * One read per painted frame. Extracted from live-token-values.ts as a
 * coherent unit when that module grew past its size bound; the contract
 * is unchanged — every cause schedules, causes landing together coalesce
 * into a single run at the next animation frame.
 */
export interface FrameScheduler {
  /** Run at the next paint, once, however many causes fired before it. */
  readonly schedule: () => void;
  readonly cancel: () => void;
}

/** Coalesces every cause into one read per painted frame. Falls back to
 *  running immediately where there is no window to schedule against. */
export function createFrameScheduler(
  resolveDocument: () => Document | null,
  run: () => void,
): FrameScheduler {
  let frame: number | null = null;
  return {
    schedule: (): void => {
      const view = resolveDocument()?.defaultView ?? null;
      if (view === null) {
        run();
        return;
      }
      frame ??= view.requestAnimationFrame(() => {
        frame = null;
        run();
      });
    },
    cancel: (): void => {
      if (frame !== null) {
        resolveDocument()?.defaultView?.cancelAnimationFrame(frame);
        frame = null;
      }
    },
  };
}
