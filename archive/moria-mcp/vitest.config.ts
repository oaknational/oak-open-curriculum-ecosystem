import { defineConfig, mergeConfig } from 'vitest/config';
import { baseTestConfig } from '../../../vitest.config.base';

export default mergeConfig(
  baseTestConfig,
  defineConfig({
    test: {
      // Override globals to false for moria (pure abstractions prefer explicit imports)
      globals: false,
    },
  }),
);
