import { mergeConfig } from 'vitest/config';
import { baseE2EConfig } from '@oaknational/workspace-config/vitest-e2e';

export default mergeConfig(baseE2EConfig, {
  test: {
    include: ['e2e-tests/**/*.e2e.test.ts'],
  },
});
