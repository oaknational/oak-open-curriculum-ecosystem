/**
 * Shared build core: TS stage entry → contract-checked harness artefact source.
 *
 * @remarks
 * One path for both consumers: the verification build (`build-workflows.ts`, unseeded —
 * proves every stage bundles and satisfies the output contract on every `pnpm build`)
 * and the run-artefact builder (`build-run-artefact.ts`, seeded with validated
 * checkpoint data for an actual launch). Bundling, harness emission, and the output
 * contract happen identically in both; only seeding and writing differ.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { build } from 'esbuild';

import type { WorkflowMeta } from '../workflow-meta.js';
import { meta as mapMeta } from '../map.meta.js';
import { meta as reduceMeta } from '../reduce.meta.js';
import { meta as validateMeta } from '../validate.meta.js';
import { meta as metaMeta } from '../meta.meta.js';
import { createWorkflowEsbuildOptions } from './esbuild-options.js';
import { emitHarnessArtefact } from './harness-emitter.js';
import { checkHarnessArtefactContract, checkSeededArtefactShape } from './output-contract.js';

/** One buildable stage: its entry module and its statically-serialised meta literal. */
export interface StageDefinition {
  readonly name: string;
  readonly entry: string;
  readonly meta: WorkflowMeta;
}

/** The four pipeline stages, in run order. */
export const STAGE_DEFINITIONS: readonly StageDefinition[] = [
  { name: 'map', entry: 'src/corpus-analysis/workflows/map.workflow.ts', meta: mapMeta },
  { name: 'reduce', entry: 'src/corpus-analysis/workflows/reduce.workflow.ts', meta: reduceMeta },
  {
    name: 'validate',
    entry: 'src/corpus-analysis/workflows/validate.workflow.ts',
    meta: validateMeta,
  },
  { name: 'meta', entry: 'src/corpus-analysis/workflows/meta.workflow.ts', meta: metaMeta },
];

/** Where built workflow artefacts land (gitignored; rebuilt before every run). */
export const WORKFLOW_OUT_DIR = 'dist/corpus-analysis/workflows';

/** esbuild warnings are blocking failures, never advisory output. */
function checkNoEsbuildWarnings(
  warnings: readonly { readonly text: string }[],
): Result<undefined, Error> {
  if (warnings.length > 0) {
    return err(
      new Error(
        ['esbuild emitted warnings:', ...warnings.map((warning) => `- ${warning.text}`)].join('\n'),
      ),
    );
  }
  return ok(undefined);
}

/** Bundle one stage entry in memory; esbuild's thrown failures translate here. */
async function bundleStageEntry<TData>(input: {
  readonly stage: StageDefinition;
  readonly runData?: TData;
}): Promise<Result<string, Error>> {
  const { stage, runData } = input;
  try {
    const result = await build(
      createWorkflowEsbuildOptions({
        entryPoints: { [stage.name]: stage.entry },
        outdir: WORKFLOW_OUT_DIR,
        ...(runData === undefined ? {} : { seed: { stage: stage.name, data: runData } }),
      }),
    );
    const warningCheck = checkNoEsbuildWarnings(result.warnings);
    if (!warningCheck.ok) {
      return warningCheck;
    }
    const bundle = (result.outputFiles ?? []).find(
      (file) => path.basename(file.path) === `${stage.name}.js`,
    );
    if (bundle === undefined) {
      return err(
        new Error(`No bundle output for stage "${stage.name}" — check the entry registration.`),
      );
    }
    return ok(bundle.text);
  } catch (cause) {
    return err(
      new Error(
        `esbuild failed for stage "${stage.name}": ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      ),
    );
  }
}

/**
 * Bundle one stage entry (optionally seeded with validated run data), emit the harness
 * shape, and enforce the full output contract. Returns the artefact source; nothing is
 * written here.
 *
 * The content-sensitive contract checks (determinism / module-system / purity pattern
 * scans) always run against the UNSEEDED bundle: seeded run data carries verbatim
 * corpus quotes that legitimately contain strings like `process.env` or `z.` — the
 * code is identical in both bundles by construction (only the run-data module differs),
 * so scanning the unseeded emission checks exactly the executable surface. The
 * artefact-shape checks (meta-first, return-last, size cap, harness-shaped syntax) run
 * on the seeded artefact that will actually be launched.
 */
export async function buildStageArtefact<TData>(input: {
  readonly stage: StageDefinition;
  readonly runData?: TData;
}): Promise<Result<string, Error>> {
  const unseededBundle = await bundleStageEntry({ stage: input.stage });
  if (!unseededBundle.ok) {
    return unseededBundle;
  }
  const unseededArtefact = emitHarnessArtefact({
    bundleSource: unseededBundle.value,
    meta: input.stage.meta,
  });
  if (!unseededArtefact.ok) {
    return unseededArtefact;
  }
  const codeContract = checkHarnessArtefactContract(unseededArtefact.value);
  if (!codeContract.ok) {
    return codeContract;
  }
  if (input.runData === undefined) {
    return ok(unseededArtefact.value);
  }
  return buildSeededArtefact(input);
}

/** The seeded emission: same code, plus the inlined run data; shape-tier contract only. */
async function buildSeededArtefact<TData>(input: {
  readonly stage: StageDefinition;
  readonly runData?: TData;
}): Promise<Result<string, Error>> {
  const seededBundle = await bundleStageEntry(input);
  if (!seededBundle.ok) {
    return seededBundle;
  }
  const seededArtefact = emitHarnessArtefact({
    bundleSource: seededBundle.value,
    meta: input.stage.meta,
  });
  if (!seededArtefact.ok) {
    return seededArtefact;
  }
  const shapeContract = checkSeededArtefactShape(seededArtefact.value);
  if (!shapeContract.ok) {
    return shapeContract;
  }
  return ok(seededArtefact.value);
}
