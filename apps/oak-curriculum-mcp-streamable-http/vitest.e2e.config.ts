import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

export default mergeConfig(baseE2EConfig, {
  test: {
    include: ['e2e-tests/**/*.e2e.test.ts'],
    exclude: ['e2e-tests/built-server.e2e.test.ts'],
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Do NOT include src/test.setup.ts here: e2e tests may allow network IO
  },
});
