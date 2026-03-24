import { mergeConfig } from 'vitest/config';

import { baseTestConfig } from './vitest.config.base.js';

export default mergeConfig(baseTestConfig, {
  test: {
    include: ['scripts/**/*.test.ts'],
    passWithNoTests: false,
  },
});
