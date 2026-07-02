/**
 * esbuild options factory for sandbox workflow bundles.
 *
 * @remarks
 * One options shape for every stage artefact: bundle everything (local imports inlined,
 * types stripped) into one ESM file per entry, `platform: 'neutral'` so the harness
 * globals (`agent`/`parallel`/`phase`/`log`/`args`) remain free identifiers, in-memory
 * output (`write: false`) so the harness emitter and output contract run before any file
 * is written. Mirrors the MCP app's programmatic-esbuild precedent
 * (`apps/oak-curriculum-mcp-streamable-http/build-scripts/esbuild-config.ts`).
 *
 * @packageDocumentation
 */

import type { BuildOptions } from 'esbuild';

import { agentSchemasInlinePlugin, runDataInlinePlugin } from './schema-inline-plugin.js';

/** A stage-tagged, already-validated run-data payload to inline into the bundle. */
export interface RunDataSeed<TData> {
  /** The stage the data was validated FOR — checked by every sandbox guard. */
  readonly stage: string;
  readonly data: TData;
}

/** Build one in-memory ESM bundle per stage entry, ready for the harness emitter. */
export function createWorkflowEsbuildOptions<TData>(input: {
  readonly entryPoints: Readonly<Record<string, string>>;
  /** Shapes `outputFiles[].path` (nothing is written — `write: false`). */
  readonly outdir: string;
  /**
   * Seed the run-data module with stage-tagged, already-validated data. Omit for a
   * verification build — the artefact then carries the unseeded sentinel and its
   * stage guard fails fast if run.
   */
  readonly seed?: RunDataSeed<TData>;
}): BuildOptions {
  return {
    entryPoints: { ...input.entryPoints },
    outdir: input.outdir,
    bundle: true,
    format: 'esm',
    platform: 'neutral',
    target: 'es2022',
    write: false,
    sourcemap: false,
    legalComments: 'none',
    plugins: [
      agentSchemasInlinePlugin(),
      ...(input.seed === undefined ? [] : [runDataInlinePlugin(input.seed.stage, input.seed.data)]),
    ],
  };
}
