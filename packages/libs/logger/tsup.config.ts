import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  entry: { index: 'src/index.ts', node: 'src/node.ts' },
  external: ['fs', 'path', 'node:fs', 'node:path'],
});
