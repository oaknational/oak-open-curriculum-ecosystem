/**
 * Experiment test setup for Oak Open Curriculum Semantic Search.
 *
 * Experiments are run manually and may use live Elasticsearch (network IO).
 * Restore fetch if the global E2E network guard is present.
 */

type Fetch = typeof fetch;
type GlobalWithFetch = typeof globalThis & {
  __ORIGINAL_FETCH__?: Fetch;
  __WITH_FETCH_BLOCKING__?: true;
};

const g: GlobalWithFetch = globalThis;
if (g.__WITH_FETCH_BLOCKING__ && typeof g.__ORIGINAL_FETCH__ === 'function') {
  globalThis.fetch = g.__ORIGINAL_FETCH__;
}
