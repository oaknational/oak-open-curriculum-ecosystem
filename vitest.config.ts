import { mergeConfig } from 'vitest/config';

import { baseTestConfig } from './vitest.config.base.js';

export default mergeConfig(baseTestConfig, {
  test: {
    include: ['scripts/**/*.unit.test.ts', 'scripts/**/*.integration.test.ts'],
    passWithNoTests: false,
  },
});
