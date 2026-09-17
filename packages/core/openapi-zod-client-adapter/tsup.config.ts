import { createLibConfig } from '@oaknational/workspace-config/tsup';

export default createLibConfig({
  external: ['fs', 'path', 'node:fs', 'node:path', 'node:module', 'node:url'],
});
