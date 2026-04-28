import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  external: ['fs', 'path', 'node:fs', 'node:path', 'node:module', 'node:url'],
});
