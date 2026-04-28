/**
 * Vitest Smoke Test Configuration for Oak Open Curriculum Semantic Search
 *
 * Smoke tests validate indexed search data with real Elasticsearch network IO.
 * They require `ELASTICSEARCH_URL` and `ELASTICSEARCH_API_KEY`.
 *
 * Per testing-strategy.md:
 * - "Smoke tests CAN trigger all IO types"
 * - "Smoke tests DO have side effects"
 * - "Smoke tests DO NOT contain mocks"
 *
 * Validation timing: env validation is deferred to `smoke-test.setup.ts`
 * rather than thrown at module load. Static-analysis tools (knip, IDE
 * indexing) load this config to discover entry points but do NOT run
 * the smoke tests, so they should not be required to provide
 * Elasticsearch credentials. The setup file runs only when smoke tests
 * actually execute, where the credentials are required and the
 * fail-fast error must surface.
 */

import process from 'node:process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';
import { loadSmokeTestEnv, type SearchCliSmokeEnv } from './smoke-test-env.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
const envResult = loadSmokeTestEnv({
  processEnv: process.env,
  startDir: thisDir,
});

// On validation failure, propagate the error through `provide` so the setup
// file can re-check and throw with a clear message during actual test runs.
// The sentinel satisfies the typed `provide` contract for static-analysis
// loads; if anything bypassed the setup-file gate, the empty URL would fail
// fast at the first Elasticsearch client call.
const SENTINEL_ENV: SearchCliSmokeEnv = { ELASTICSEARCH_URL: '', ELASTICSEARCH_API_KEY: '' };
const providedEnv: SearchCliSmokeEnv = envResult.ok ? envResult.value : SENTINEL_ENV;
const providedError: string | undefined = envResult.ok ? undefined : envResult.error.message;

export default mergeConfig(baseE2EConfig, {
  test: {
    provide: {
      searchCliSmokeEnv: providedEnv,
      searchCliSmokeEnvLoadError: providedError,
    },
    setupFiles: ['./smoke-test.setup.ts'],
    include: ['smoke-tests/**/*.smoke.test.ts'],
    isolate: true,
    maxWorkers: 1,
    // Smoke tests hit live servers, so longer timeout
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
