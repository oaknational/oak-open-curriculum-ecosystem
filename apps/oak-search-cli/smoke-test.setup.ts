/**
 * Smoke Test Setup for Oak Open Curriculum Semantic Search
 *
 * Receives validated smoke-test environment from `vitest.smoke.config.ts` and
 * initialises shared clients for tests that need real Elasticsearch IO.
 *
 * Per testing-strategy.md:
 * - "Smoke tests CAN trigger all IO types"
 * - "Smoke tests DO have side effects"
 * - "Smoke tests DO NOT contain mocks"
 *
 */

import { inject } from 'vitest';
import { initializeEsClient } from './src/lib/es-client.js';

type Fetch = typeof fetch;
type GlobalWithFetch = typeof globalThis & {
  __ORIGINAL_FETCH__?: Fetch;
  __WITH_FETCH_BLOCKING__?: true;
};

// Smoke tests allow real network IO; undo the E2E fetch guard if present.
const g: GlobalWithFetch = globalThis;
if (g.__WITH_FETCH_BLOCKING__ && typeof g.__ORIGINAL_FETCH__ === 'function') {
  globalThis.fetch = g.__ORIGINAL_FETCH__;
}

initializeEsClient(inject('searchCliSmokeEnv'));
