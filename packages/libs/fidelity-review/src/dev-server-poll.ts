/*
 * Bounded probes for the dev-server lifecycle: one HTTP reachability probe
 * and a deadline-bounded poll loop that its caller can stop early
 * (no-unbounded-host-load: every wait is bounded). Split from dev-server.ts
 * for module size.
 */
const POLL_MS = 1000;

/** Whether anything answers HTTP on `base` within 2s. */
export async function responds(base: string): Promise<boolean> {
  try {
    await fetch(base, { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}

/** Sleep `ms`, waking early when `signal` aborts. It never rejects, so
 *  there is no failure to catch: the abort is a wake-up, not an error. */
function wait(ms: number, signal: AbortSignal | undefined): Promise<void> {
  return new Promise<void>((resolve) => {
    if (signal?.aborted === true) {
      resolve();
      return;
    }
    const wake = (): void => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', wake);
      resolve();
    };
    const timer = setTimeout(wake, ms);
    signal?.addEventListener('abort', wake, { once: true });
  });
}

/** Poll `predicate` every POLL_MS until true, the bounded deadline passes,
 *  or `signal` aborts. */
export async function pollUntil(
  predicate: () => Promise<boolean>,
  deadlineMs: number,
  signal?: AbortSignal,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < deadlineMs && signal?.aborted !== true) {
    if (await predicate()) {
      return true;
    }
    await wait(POLL_MS, signal);
  }
  return false;
}
