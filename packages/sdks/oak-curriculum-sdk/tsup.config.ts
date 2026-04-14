import { createSdkConfig } from '../../../tsup.config.base.js';

export default createSdkConfig(
  [
    'src/*.ts',
    'src/client/**/*.ts',
    'src/config/**/*.ts',
    'src/types/**/*.ts',
    'src/public/**/*.ts',
    'src/mcp/**/*.ts',
    'src/validation/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  { external: ['zod'] },
);
