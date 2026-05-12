import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  entry: {
    index: 'src/index.ts',
    'term/index': 'src/term/index.ts',
    'dataset/index': 'src/dataset/index.ts',
    'jsonld/index': 'src/jsonld/index.ts',
    'canon/index': 'src/canon/index.ts',
    'vocab/index': 'src/vocab/index.ts',
  },
});
