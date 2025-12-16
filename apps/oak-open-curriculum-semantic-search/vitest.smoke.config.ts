/**
 * Vitest Smoke Test Configuration for Oak Open Curriculum Semantic Search
 *
 * Smoke tests validate running systems with real network IO.
 * They require the semantic search server to be running (`pnpm dev`).
 *
 * Per testing-strategy.md:
 * - "Smoke tests CAN trigger all IO types"
 * - "Smoke tests DO have side effects"
 * - "Smoke tests DO NOT contain mocks"
 *
 */

import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

export default mergeConfig(baseE2EConfig, {
  test: {
    // Load .env.local for real ES credentials before tests run
    setupFiles: ['./smoke-test.setup.ts'],
    include: ['smoke-tests/**/*.smoke.test.ts'],
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Smoke tests hit live servers, so longer timeout
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
