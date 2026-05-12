import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  entry: {
    index: 'src/index.ts',
    'strict-jsonld/index': 'src/strict-jsonld/index.ts',
    'jsonld-compatible/index': 'src/jsonld-compatible/index.ts',
    'plain-json-tree/index': 'src/plain-json-tree/index.ts',
    'records/index': 'src/records/index.ts',
    'node-edge-list/index': 'src/node-edge-list/index.ts',
    'custom-mapping/index': 'src/custom-mapping/index.ts',
  },
});
