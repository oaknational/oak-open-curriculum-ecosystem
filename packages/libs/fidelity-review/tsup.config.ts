import { createLibConfig } from '@oaknational/workspace-config/tsup';

/*
 * No src/index.ts barrel by design: a barrel would couple every consumer
 * to every module — importing escapeHtml would drag in dev-server's
 * child_process surface. Per-module subpath exports (see package.json
 * `exports`) keep each consumer's dependency surface exactly what it
 * uses. Every subpath source is therefore its own build entry.
 */
export default createLibConfig({
  entry: [
    'src/support.ts',
    'src/dev-server.ts',
    'src/static-path-guard.ts',
    'src/capture-flags.ts',
    'src/register.ts',
    'src/pairing-schema.ts',
    'src/capture-settle.ts',
    'src/capture-manifest.ts',
    'src/orchestrator.ts',
    'src/visual-stats.ts',
    'src/visual-calibration.ts',
    'src/visual-correlation.ts',
    'src/png-codec.ts',
  ],
});
