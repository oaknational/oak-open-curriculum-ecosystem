/**
 * Vitest E2E Configuration for Oak Open Curriculum Semantic Search
 *
 * Extends the base E2E config for running network-free E2E suites.
 *
 * Live Elasticsearch validation belongs in smoke tests and experiments.
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
    // E2E tests spawn real processes; allow a bit more headroom.
    testTimeout: 60000,
    hookTimeout: 60000,
  },
});
