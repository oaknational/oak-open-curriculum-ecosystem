/**
 * Guard against accidental real network calls in tests
 *
 * - Stub global fetch if present
 * - Throw on any unmocked fetch usage
 */

type OriginalGlobalThis = typeof globalThis;
type Fetch = typeof fetch;
type GlobalWithFetch = OriginalGlobalThis & {
  __ORIGINAL_FETCH__?: Fetch;
  __WITH_FETCH_BLOCKING__?: true;
  __IS_TEST_SETUP__?: true;
};

const g: GlobalWithFetch = globalThis;

// Check-then-patch: a second execution of this setup in one process (e.g.
// under a non-isolating pool) must not capture the blocking fetch as the
// "original" and lose the real one.
if (typeof g.fetch === 'function' && g.__WITH_FETCH_BLOCKING__ !== true) {
  const originalFetch = g.fetch.bind(globalThis);

  const blockingFetch: Fetch = (input, init) =>
    Promise.reject(
      new Error(
        `Network calls are blocked in tests. Attempted fetch(${JSON.stringify(input)}, ${JSON.stringify(init)}).`,
      ),
    );
  g.fetch = blockingFetch;

  // Keep a reference if specific tests choose to restore
  g.__ORIGINAL_FETCH__ = originalFetch;
  g.__WITH_FETCH_BLOCKING__ = true;
  g.__IS_TEST_SETUP__ = true;
}
