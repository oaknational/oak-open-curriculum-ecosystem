import { createSdkConfig } from '@oaknational/workspace-config/tsup';

export default createSdkConfig([
  'src/**/*.ts',
  '!src/**/*.test.ts',
  '!src/**/*.spec.ts',
  '!src/**/*.typecheck.ts',
]);
