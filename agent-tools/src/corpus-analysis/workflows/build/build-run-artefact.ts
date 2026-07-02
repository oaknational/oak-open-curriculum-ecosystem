/**
 * Build one SEEDED, launchable workflow artefact from committed checkpoint files.
 *
 * @remarks
 * The operator's launch tool. Reads the named checkpoint JSONs, re-parses them with the
 * zod stage contracts (strict validation at the Node boundary — the sandbox receives
 * only data that passed here), derives the stage's run data through the pipeline glue
 * (`run-inputs.ts` — partial-map refusal, grounding projection, resume-id derivation,
 * the merged-set meta gate), bundles the stage seeded, and writes
 * `dist/corpus-analysis/workflows/<stage>.workflow.seeded.mjs` for
 * `Workflow({scriptPath})`.
 *
 * Usage (cwd = the agent-tools workspace):
 *
 * ```bash
 * pnpm build-run-artefact --stage map --partition <partition.json>
 * pnpm build-run-artefact --stage reduce --map-result <leaves.json>
 * pnpm build-run-artefact --stage validate --map-result <leaves.json> \
 *   --reduce-result <candidates.json> --ceiling 30000000 [--validate-result <prior.json> ...]
 * pnpm build-run-artefact --stage meta --reduce-result <candidates.json> \
 *   --validate-result <dispositions.json> [--validate-result <tail.json> ...]
 * ```
 *
 * @packageDocumentation
 */

import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseArgs } from 'node:util';

import { err, ok, type Result } from '@oaknational/result';

import type {
  MapRunData,
  MetaRunData,
  ReduceRunData,
  ValidateResult,
  ValidateRunData,
} from '../stage-io.js';
import {
  parseMapResult,
  parseMapRunData,
  parseMetaRunData,
  parseReduceResult,
  parseReduceRunData,
  parseValidateResult,
  parseValidateRunData,
} from '../stage-io.js';
import { metaRunDataFrom, reduceRunDataFrom, validateRunDataFrom } from '../run-inputs.js';
import { buildStageArtefact, STAGE_DEFINITIONS, WORKFLOW_OUT_DIR } from './workflow-builder.js';

interface CliFlags {
  readonly stage: string;
  readonly partition?: string;
  readonly mapResult?: string;
  readonly reduceResult?: string;
  readonly validateResults: readonly string[];
  readonly ceiling?: number;
}

async function readJson(filePath: string): Promise<Result<unknown, Error>> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return ok(JSON.parse(raw));
  } catch (cause) {
    return err(
      new Error(
        `Cannot read checkpoint ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
        {
          cause,
        },
      ),
    );
  }
}

async function readAnd<T>(
  filePath: string | undefined,
  label: string,
  parse: (value: unknown) => Result<T, Error>,
): Promise<Result<T, Error>> {
  if (filePath === undefined) {
    return err(new Error(`Missing required checkpoint flag for ${label}.`));
  }
  const json = await readJson(filePath);
  return json.ok ? parse(json.value) : json;
}

/** Every stage's run data, as the concrete union — never widened back to unknown. */
type StageRunData = MapRunData | ReduceRunData | ValidateRunData | MetaRunData;

/**
 * Derive and RE-VALIDATE the stage's run data. The derivation functions return typed
 * data already, but the final parse through the stage contract is the boundary
 * guarantee `stage-io.ts` promises ("validated before inlining") — it also catches
 * flag-level slips the derivations cannot (e.g. a fractional `--ceiling` surviving
 * `Number()`), and runs the merged-set duplicate-id refine for meta.
 */
async function deriveRunData(flags: CliFlags): Promise<Result<StageRunData, Error>> {
  if (flags.stage === 'map') {
    return readAnd(flags.partition, '--partition', parseMapRunData);
  }
  if (flags.stage === 'reduce') {
    const mapResult = await readAnd(flags.mapResult, '--map-result', parseMapResult);
    if (!mapResult.ok) {
      return mapResult;
    }
    const derived = reduceRunDataFrom(mapResult.value);
    return derived.ok ? parseReduceRunData(derived.value) : derived;
  }
  if (flags.stage === 'validate') {
    const derived = await deriveValidateRunData(flags);
    return derived.ok ? parseValidateRunData(derived.value) : derived;
  }
  const derived = await deriveMetaRunData(flags);
  return derived.ok ? parseMetaRunData(derived.value) : derived;
}

async function readValidateResults(
  paths: readonly string[],
): Promise<Result<ValidateResult[], Error>> {
  const results: ValidateResult[] = [];
  for (const filePath of paths) {
    const parsed = await readAnd(filePath, '--validate-result', parseValidateResult);
    if (!parsed.ok) {
      return parsed;
    }
    results.push(parsed.value);
  }
  return ok(results);
}

async function deriveValidateRunData(flags: CliFlags): Promise<Result<ValidateRunData, Error>> {
  const mapResult = await readAnd(flags.mapResult, '--map-result', parseMapResult);
  if (!mapResult.ok) {
    return mapResult;
  }
  const reduceResult = await readAnd(flags.reduceResult, '--reduce-result', parseReduceResult);
  if (!reduceResult.ok) {
    return reduceResult;
  }
  const priors = await readValidateResults(flags.validateResults);
  if (!priors.ok) {
    return priors;
  }
  if (flags.ceiling === undefined || Number.isNaN(flags.ceiling)) {
    return err(new Error('validate requires an explicit --ceiling (no default, ever).'));
  }
  return validateRunDataFrom({
    mapResult: mapResult.value,
    reduceResult: reduceResult.value,
    priorValidateResults: priors.value,
    validateTokenCeiling: flags.ceiling,
  });
}

async function deriveMetaRunData(flags: CliFlags): Promise<Result<MetaRunData, Error>> {
  const reduceResult = await readAnd(flags.reduceResult, '--reduce-result', parseReduceResult);
  if (!reduceResult.ok) {
    return reduceResult;
  }
  if (flags.validateResults.length === 0) {
    return err(new Error('meta requires at least one --validate-result.'));
  }
  const validateResults = await readValidateResults(flags.validateResults);
  if (!validateResults.ok) {
    return validateResults;
  }
  return metaRunDataFrom({
    reduceResult: reduceResult.value,
    validateResults: validateResults.value,
  });
}

function parseCliFlags(): Result<CliFlags, Error> {
  try {
    const { values } = parseArgs({
      options: {
        stage: { type: 'string' },
        partition: { type: 'string' },
        'map-result': { type: 'string' },
        'reduce-result': { type: 'string' },
        'validate-result': { type: 'string', multiple: true },
        ceiling: { type: 'string' },
      },
    });
    return ok({
      stage: values.stage ?? '',
      partition: values.partition,
      mapResult: values['map-result'],
      reduceResult: values['reduce-result'],
      validateResults: values['validate-result'] ?? [],
      ceiling: values.ceiling === undefined ? undefined : Number(values.ceiling),
    });
  } catch (cause) {
    return err(
      new Error(`Invalid flags: ${cause instanceof Error ? cause.message : String(cause)}`, {
        cause,
      }),
    );
  }
}

async function resolveRunData(): Promise<
  Result<{ stage: (typeof STAGE_DEFINITIONS)[number]; data: StageRunData }, Error>
> {
  const flags = parseCliFlags();
  if (!flags.ok) {
    return flags;
  }
  const stage = STAGE_DEFINITIONS.find((definition) => definition.name === flags.value.stage);
  if (stage === undefined) {
    return err(
      new Error(`Unknown stage "${flags.value.stage}" — expected map | reduce | validate | meta.`),
    );
  }
  const data = await deriveRunData(flags.value);
  return data.ok ? ok({ stage, data: data.value }) : data;
}

const resolved = await resolveRunData();

if (resolved.ok) {
  const artefact = await buildStageArtefact({
    stage: resolved.value.stage,
    runData: resolved.value.data,
  });
  if (artefact.ok) {
    const outPath = path.join(WORKFLOW_OUT_DIR, `${resolved.value.stage.name}.workflow.seeded.mjs`);
    await mkdir(WORKFLOW_OUT_DIR, { recursive: true });
    await writeFile(outPath, artefact.value, 'utf8');
    process.stdout.write(
      `seeded ${outPath} (${artefact.value.length} chars, contract green) — launch with Workflow({scriptPath}) from the repo root.\n`,
    );
  } else {
    process.stderr.write(`${artefact.error.message}\n`);
    process.exitCode = 1;
  }
} else {
  process.stderr.write(`${resolved.error.message}\n`);
  process.exitCode = 1;
}
