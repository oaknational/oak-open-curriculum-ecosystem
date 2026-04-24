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
 */

import process from 'node:process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';
import { loadSmokeTestEnv } from './smoke-test-env.js';

const thisDir = dirname(fileURLToPath(import.meta.url));
const envResult = loadSmokeTestEnv({
  processEnv: process.env,
  startDir: thisDir,
});

if (!envResult.ok) {
  throw new Error(`Smoke test environment validation failed: ${envResult.error.message}`);
}

export default mergeConfig(baseE2EConfig, {
  test: {
    provide: {
      searchCliSmokeEnv: envResult.value,
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
