import { describe, expect, it } from 'vitest';

import { createWorkflowEsbuildOptions } from './esbuild-options.js';

/**
 * The behavioural proof of the bundling options lives in the output contract and the
 * verification build (every stage bundles contract-green on every `pnpm build`). These
 * tests pin only the factory's own behaviour: the conditional run-data seeding and the
 * always-installed schema substitution.
 */

describe('createWorkflowEsbuildOptions', () => {
  const base = {
    entryPoints: { map: 'src/corpus-analysis/workflows/map.workflow.ts' },
    outdir: 'dist/corpus-analysis/workflows',
  };

  it('always installs the schema-substitution plugin', () => {
    expect(createWorkflowEsbuildOptions(base).plugins?.map((plugin) => plugin.name)).toContain(
      'inline-derived-agent-schemas',
    );
  });

  it('installs the run-data plugin only when a stage-tagged seed is provided', () => {
    expect(createWorkflowEsbuildOptions(base).plugins?.map((plugin) => plugin.name)).not.toContain(
      'inline-run-data',
    );
    const seeded = createWorkflowEsbuildOptions({
      ...base,
      seed: { stage: 'map', data: { windows: [] } },
    });
    expect(seeded.plugins?.map((plugin) => plugin.name)).toContain('inline-run-data');
  });
});
