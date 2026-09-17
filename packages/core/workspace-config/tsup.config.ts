/**
 * Build config for the workspace-config package itself.
 *
 * Imports the factory from `./src/` (a within-workspace relative import)
 * rather than through the package's own `exports` map — a self-reference
 * resolves through `dist/`, which is chicken-and-egg on a cold build.
 * Consuming its own factory also makes every package build a live probe
 * of the factory's behaviour.
 */

import { createLibConfig } from './src/tsup.config.base.js';

export default createLibConfig({
  entry: [
    'src/vitest.config.base.ts',
    'src/vitest.e2e.config.base.ts',
    'src/tsup.config.base.ts',
    'src/no-network.setup.ts',
  ],
  external: ['tsup', 'vitest', 'vitest/config'],
});
