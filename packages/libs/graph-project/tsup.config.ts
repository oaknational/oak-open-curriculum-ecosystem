import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  entry: {
    index: 'src/index.ts',
    'property-graph/index': 'src/property-graph/index.ts',
    'projection/index': 'src/projection/index.ts',
    'adjacency/index': 'src/adjacency/index.ts',
  },
});
