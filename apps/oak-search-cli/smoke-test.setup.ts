/**
 * Smoke Test Setup for Oak Open Curriculum Semantic Search
 *
 * Loads environment variables from `.env.local` for smoke tests that need
 * real Elasticsearch credentials and API keys.
 *
 * Per testing-strategy.md:
 * - "Smoke tests CAN trigger all IO types"
 * - "Smoke tests DO have side effects"
 * - "Smoke tests DO NOT contain mocks"
 *
 */

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

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRuntimeConfig } from './src/runtime-config.js';
import { initializeEsClient } from './src/lib/es-client.js';

const thisDir = dirname(fileURLToPath(import.meta.url));

const configResult = loadRuntimeConfig({
  processEnv: process.env,
  startDir: thisDir,
});
if (configResult.ok) {
  initializeEsClient(configResult.value.env);
}
