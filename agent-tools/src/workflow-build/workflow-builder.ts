/**
 * Shared build core: TS stage entry → contract-checked harness artefact source.
 *
 * @remarks
 * One path for every consumer in every pipeline module: the verification build
 * (`run-verification-build.ts`, unseeded — proves every stage bundles and satisfies the
 * output contract on every `pnpm build`) and each module's run-artefact builder
 * (seeded with validated checkpoint data for an actual launch). Bundling, harness
 * emission, and the output contract happen identically in both; only seeding and
 * writing differ.
 *
 * Module coupling arrives ONCE as a {@link WorkflowBuildConfig} — the module's out dir
 * and its instantiated inline plugins (schemas always, run data when seeding). The
 * stage registries, metas, and CLIs stay module-side; everything here is
 * module-agnostic.
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { build, type Plugin } from 'esbuild';

import { createWorkflowEsbuildOptions } from './esbuild-options.js';
import { emitHarnessArtefact } from './harness-emitter.js';
import { checkHarnessArtefactContract, checkSeededArtefactShape } from './output-contract.js';
import type { WorkflowMeta } from './workflow-meta.js';

/** One buildable stage: its entry module and its statically-serialised meta literal. */
export interface StageDefinition {
  readonly name: string;
  readonly entry: string;
  readonly meta: WorkflowMeta;
}

/** The consuming module's build coupling, instantiated once per module. */
export interface WorkflowBuildConfig {
  /** Where built artefacts land (shapes `outputFiles[].path`; the builder writes nothing). */
  readonly outDir: string;
  /** The module's agent-schemas inline plugin (always applied). */
  readonly agentSchemasPlugin: Plugin;
  /** Factory for the module's run-data seeding plugin (applied only when seeding). */
  readonly makeRunDataPlugin: (stage: string, data: unknown) => Plugin;
}

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
  readonly config: WorkflowBuildConfig;
  readonly stage: StageDefinition;
  readonly runData?: TData;
}): Promise<Result<string, Error>> {
  const { config, stage, runData } = input;
  try {
    const result = await build(
      createWorkflowEsbuildOptions({
        entryPoints: { [stage.name]: stage.entry },
        outdir: config.outDir,
        plugins: [
          config.agentSchemasPlugin,
          ...(runData === undefined ? [] : [config.makeRunDataPlugin(stage.name, runData)]),
        ],
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
  } catch (error) {
    return err(
      new Error(
        `esbuild failed for stage "${stage.name}": ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
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
  readonly config: WorkflowBuildConfig;
  readonly stage: StageDefinition;
  readonly runData?: TData;
}): Promise<Result<string, Error>> {
  const unseededBundle = await bundleStageEntry({ config: input.config, stage: input.stage });
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
  readonly config: WorkflowBuildConfig;
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
