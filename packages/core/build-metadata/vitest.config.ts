import { defineConfig, mergeConfig } from 'vitest/config';
import { baseTestConfig } from '../../../vitest.config.base';

export default mergeConfig(
  baseTestConfig,
  defineConfig({
    test: {
      include: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'tests/**/*.test.ts',
        'tests/**/*.spec.ts',
        'build-scripts/**/*.unit.test.mjs',
        'build-scripts/**/*.integration.test.mjs',
      ],
    },
  }),
);
