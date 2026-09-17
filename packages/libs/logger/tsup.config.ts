import { createLibConfig } from '@oaknational/workspace-config/tsup';

export default createLibConfig({
  entry: { index: 'src/index.ts', node: 'src/node.ts' },
  external: ['fs', 'path', 'node:fs', 'node:path'],
});
