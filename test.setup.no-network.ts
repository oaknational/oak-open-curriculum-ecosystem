/**
 * Global E2E test setup: guard against accidental network IO.
 *
 * E2E tests in this repository are required to be network-free.
 * Use dependency injection and local fakes instead of real services.
 *
 * Note: child processes spawned by tests are not affected by this guard.
 * Those tests must inject environment/config to keep the child network-free.
 */

type Fetch = typeof fetch;

type GlobalWithFetch = typeof globalThis & {
  __ORIGINAL_FETCH__?: Fetch;
  __WITH_FETCH_BLOCKING__?: true;
};

function describeValue(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

const g: GlobalWithFetch = globalThis;

// Check-then-patch: a second execution of this setup in one process (e.g.
// under a non-isolating pool) must not capture the blocking fetch as the
// "original" and lose the real one.
if (typeof g.fetch === 'function' && g.__WITH_FETCH_BLOCKING__ !== true) {
  const originalFetch = g.fetch.bind(globalThis);

  const blockingFetch: Fetch = (input, init) =>
    Promise.reject(
      new Error(
        `Network calls are blocked in E2E tests. Attempted fetch(${describeValue(
          input,
        )}, ${describeValue(init)}).`,
      ),
    );

  g.fetch = blockingFetch;
  g.__ORIGINAL_FETCH__ = originalFetch;
  g.__WITH_FETCH_BLOCKING__ = true;
}
