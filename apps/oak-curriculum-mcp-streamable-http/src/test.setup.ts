/**
 * Guard against accidental real network calls in tests
 *
 * - Stub global fetch if present
 * - Throw on any unmocked fetch usage
 */

type OriginalGlobalThis = typeof globalThis;
type Fetch = typeof fetch;
interface GlobalWithFetch extends OriginalGlobalThis {
  __ORIGINAL_FETCH__?: Fetch;
  __WITH_FETCH_BLOCKING__?: true;
  __IS_TEST_SETUP__?: true;
}

const g: GlobalWithFetch = globalThis;

if (typeof g.fetch === 'function') {
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
