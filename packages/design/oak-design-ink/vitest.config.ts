import { mergeConfig } from 'vitest/config';

import { baseTestConfig } from '@oaknational/workspace-config/vitest';

export default mergeConfig(baseTestConfig, {
  test: {
    include: [
      'src/**/*.test.ts',
      'src/**/*.test.tsx',
      'src/**/*.spec.ts',
      'src/**/*.spec.tsx',
      'tests/**/*.test.ts',
      'tests/**/*.test.tsx',
      'tests/**/*.spec.ts',
      'tests/**/*.spec.tsx',
    ],
  },
});
