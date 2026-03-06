/**
 * Vitest Experiment Configuration for Oak Open Curriculum Semantic Search
 *
 * Experiments are informational tests that measure search quality but don't
 * enforce pass/fail criteria. They are run manually to gather data, not as
 * part of CI/CD pipelines.
 *
 * Run experiments with:
 *   pnpm vitest run -c vitest.experiment.config.ts
 *
 */

import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

export default mergeConfig(baseE2EConfig, {
  test: {
    setupFiles: ['./experiment-test.setup.ts'],
    include: ['evaluation/experiments/current/**/*.experiment.ts'],
    isolate: true,
    maxWorkers: 1,
    // Experiments hit live ES, so longer timeout
    testTimeout: 120000,
    hookTimeout: 120000,
  },
});
