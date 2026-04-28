import { createSdkConfig } from '../../../tsup.config.base.js';

export default createSdkConfig(
  [
    'src/index.ts',
    'src/read.ts',
    'src/admin.ts',
    'src/create-search-sdk.ts',
    'src/create-search-retrieval.ts',
    'src/types/**/*.ts',
    'src/retrieval/**/*.ts',
    'src/admin/**/*.ts',
    'src/observability/**/*.ts',
    'src/internal/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  { external: ['zod', '@elastic/elasticsearch'] },
);
