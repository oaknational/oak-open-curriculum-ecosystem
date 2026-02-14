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

import { config as dotenvConfig } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const envLocalPath = resolve(thisDir, '.env.local');

// Load .env.local first (app-specific credentials)
dotenvConfig({ path: envLocalPath });

// Then try repo root .env as fallback for any missing vars
const repoRootEnv = resolve(thisDir, '../../.env');
dotenvConfig({ path: repoRootEnv });
