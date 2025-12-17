/**
 * Vitest E2E Configuration for Oak Open Curriculum Semantic Search
 *
 * Extends the base E2E config for running search quality benchmarks
 * and other E2E tests against a running Next.js server.
 *
 */

import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

export default mergeConfig(baseE2EConfig, {
  test: {
    include: ['**/*.e2e.test.ts'],
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // E2E tests hit the live search API, so longer timeout
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
