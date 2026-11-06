/**
 * Derive and RE-VALIDATE one stage's run data from committed checkpoint file paths.
 *
 * @remarks
 * Split out of `build-run-artefact.ts` (file-length discipline): this module owns the
 * checkpoint-read + pipeline-glue + boundary-re-parse logic; the CLI entry owns argv
 * parsing and the write. The re-parse through `stage-io.ts`'s parsers after
 * `run-inputs.ts` derivation is the boundary guarantee `stage-io.ts` promises
 * ("validated before inlining") — it also catches flag-level slips the derivations cannot
 * (e.g. a fractional `--ceiling` surviving `Number()`).
 *
 * @packageDocumentation
 */

import { err, type Result } from '@oaknational/result';

import { resolveRepoRoot } from '../../../core/repo-root.js';
import { readAnd, readValidateResults, type Containment } from './derive-stage-checkpoint-io.js';
import { parseGazetteerFile, projectGazetteer } from '../gazetteer-schema.js';
import { metaRunDataFrom, reduceRunDataFrom, validateRunDataFrom } from '../run-inputs.js';
import type { MapRunData, MetaRunData, ReduceRunData, ValidateRunData } from '../stage-io.js';
import {
  parseMapResult,
  parseMapRunData,
  parseMetaRunData,
  parsePartitionFile,
  parseReduceResult,
  parseReduceRunData,
  parseValidateRunData,
} from '../stage-io.js';

/**
 * Containment seam for {@link deriveRunData} (ADR-078): the repo root and the
 * canonicaliser are injectable so containment refusals describe with literal
 * fixtures deterministically on every host, with no IO. Production callers
 * omit both; the defaults resolve the real repo root and use the real
 * symlink-resolving canonicaliser.
 */
export interface DeriveRunDataOptions {
  readonly repoRoot?: string;
  readonly realpath?: (path: string) => string;
}

export interface CliFlags {
  readonly stage: string;
  readonly partition?: string;
  readonly gazetteer?: string;
  readonly mapResult?: string;
  readonly reduceResult?: string;
  readonly validateResults: readonly string[];
  readonly ceiling?: number;
}

/** Every stage's run data, as the concrete union — never widened back to unknown. */
export type StageRunData = MapRunData | ReduceRunData | ValidateRunData | MetaRunData;

async function deriveMapRunData(
  flags: CliFlags,
  containment: Containment,
): Promise<Result<MapRunData, Error>> {
  // The closed canonical {"windows": [...]} shape — parsePartitionFile rejects a typo'd
  // key, a stray sibling key, or a bare window array (AIP-126 item 8).
  const partition = await readAnd(flags.partition, '--partition', parsePartitionFile, containment);
  if (!partition.ok) {
    return partition;
  }
  const gazetteerFile = await readAnd(
    flags.gazetteer,
    '--gazetteer',
    parseGazetteerFile,
    containment,
  );
  if (!gazetteerFile.ok) {
    return gazetteerFile;
  }
  return parseMapRunData({
    windows: partition.value.windows,
    gazetteer: projectGazetteer(gazetteerFile.value),
  });
}

async function deriveValidateRunData(
  flags: CliFlags,
  containment: Containment,
): Promise<Result<ValidateRunData, Error>> {
  const mapResult = await readAnd(flags.mapResult, '--map-result', parseMapResult, containment);
  if (!mapResult.ok) {
    return mapResult;
  }
  const reduceResult = await readAnd(
    flags.reduceResult,
    '--reduce-result',
    parseReduceResult,
    containment,
  );
  if (!reduceResult.ok) {
    return reduceResult;
  }
  const priors = await readValidateResults(flags.validateResults, containment);
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

async function deriveMetaRunData(
  flags: CliFlags,
  containment: Containment,
): Promise<Result<MetaRunData, Error>> {
  const mapResult = await readAnd(flags.mapResult, '--map-result', parseMapResult, containment);
  if (!mapResult.ok) {
    return mapResult;
  }
  const reduceResult = await readAnd(
    flags.reduceResult,
    '--reduce-result',
    parseReduceResult,
    containment,
  );
  if (!reduceResult.ok) {
    return reduceResult;
  }
  // Zero --validate-result flags is VALID for a zero-cluster reduce (validate was
  // rightly skipped); metaRunDataFrom's coverage gate errs when clusters exist
  // without dispositions, naming each one.
  const validateResults = await readValidateResults(flags.validateResults, containment);
  if (!validateResults.ok) {
    return validateResults;
  }
  return metaRunDataFrom({
    mapResult: mapResult.value,
    reduceResult: reduceResult.value,
    validateResults: validateResults.value,
  });
}

async function deriveReduceRunData(
  flags: CliFlags,
  containment: Containment,
): Promise<Result<ReduceRunData, Error>> {
  const mapResult = await readAnd(flags.mapResult, '--map-result', parseMapResult, containment);
  if (!mapResult.ok) {
    return mapResult;
  }
  return reduceRunDataFrom(mapResult.value);
}

/** Await the stage derivation, then re-validate through the stage's parser. */
async function revalidated<Derived, Parsed>(
  derived: Promise<Result<Derived, Error>>,
  parse: (value: Derived) => Result<Parsed, Error>,
): Promise<Result<Parsed, Error>> {
  const outcome = await derived;
  return outcome.ok ? parse(outcome.value) : outcome;
}

/** Derive and RE-VALIDATE the stage's run data from checkpoint file paths named in `flags`. */
export async function deriveRunData(
  flags: CliFlags,
  options: DeriveRunDataOptions = {},
): Promise<Result<StageRunData, Error>> {
  const containment: Containment = {
    repoRoot: options.repoRoot ?? resolveRepoRoot(import.meta.url),
    realpath: options.realpath,
  };
  if (flags.stage === 'map') {
    return deriveMapRunData(flags, containment);
  }
  if (flags.stage === 'reduce') {
    return revalidated(deriveReduceRunData(flags, containment), parseReduceRunData);
  }
  if (flags.stage === 'validate') {
    return revalidated(deriveValidateRunData(flags, containment), parseValidateRunData);
  }
  return revalidated(deriveMetaRunData(flags, containment), parseMetaRunData);
}
