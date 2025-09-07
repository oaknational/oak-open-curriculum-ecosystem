import { defineConfig, mergeConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { baseTestConfig } from '../../vitest.config.base';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  baseTestConfig,
  defineConfig({
    resolve: {
      conditions: ['development'],
      alias: {
        '@/*': resolve(__dirname, './src/*'),
        '@oaknational/mcp-logger': resolve(__dirname, '../../packages/libs/logger/src/index.ts'),
      },
    },
    test: {
      include: ['**/*.unit.test.ts', '**/*.integration.test.ts', '**/*.api.test.ts'],
    },
  }),
);
