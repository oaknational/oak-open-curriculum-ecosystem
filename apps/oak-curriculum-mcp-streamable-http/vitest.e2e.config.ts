import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '../../vitest.e2e.config.base';

export default mergeConfig(baseE2EConfig, {
  test: {
    include: ['e2e-tests/**/*.e2e.test.ts'],
    isolate: true,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Network IO is forbidden in E2E tests; blocking is configured in vitest.e2e.config.base.ts.
  },
});
