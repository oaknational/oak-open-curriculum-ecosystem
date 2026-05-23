import { createSdkConfig } from '../../../tsup.config.base.js';

export default createSdkConfig([
  'src/index.ts',
  'src/eef-strands/index.ts',
  'src/threads/index.ts',
  '!src/**/*.test.ts',
  '!src/**/*.spec.ts',
]);
