import { defineConfig, mergeConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { baseTestConfig } from '../../../vitest.config.base';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  baseTestConfig,
  defineConfig({
    resolve: {
      alias: {
        '@/*': resolve(__dirname, './src/*'),
        '@organa/*': resolve(__dirname, './src/organa/*'),
        '@psychon/*': resolve(__dirname, './src/psychon/*'),
      },
    },
    test: {
      include: ['**/*.unit.test.ts', '**/*.integration.test.ts', '**/*.api.test.ts'],
    },
  }),
);
