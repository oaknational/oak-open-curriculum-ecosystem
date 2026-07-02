/**
 * Node-side pipeline glue: derive each stage's run data from the previous stage's
 * committed result envelope.
 *
 * @remarks
 * The structural gates that used to be operator discipline live here as code:
 *
 * - a PARTIAL map (any zero-leaf window) cannot seed reduce or validate;
 * - validate's grounding leaves are the size-capped projection, never full leaves;
 * - resume ids derive from the prior validate results' actual terminal dispositions,
 *   never a hand-maintained list;
 * - meta's merged disposition set must cover every reduce candidate exactly once,
 *   terminally — a missing, held, duplicate-conflicting, or unknown candidate is a
 *   typed error, so meta can never score recall over a wrong denominator.
 *
 * Consumed by `build-run-artefact.ts`, which validates the checkpoint files with the
 * stage-io zod contracts before calling these.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import type {
  Disposition,
  DispositionedCandidate,
  MapResult,
  MetaRunData,
  ReduceResult,
  ReduceRunData,
  ValidateResult,
  ValidateRunData,
} from './stage-io.js';

type MapSuccess = Extract<MapResult, { ok: true }>;
type ReduceSuccess = Extract<ReduceResult, { ok: true }>;
type ValidateSuccess = Extract<ValidateResult, { ok: true }>;

function completeMap(mapResult: MapResult): Result<MapSuccess, Error> {
  if (!mapResult.ok) {
    return err(new Error(`map stage failed: ${mapResult.error}`));
  }
  if (!mapResult.mapComplete) {
    return err(
      new Error(
        `map is INCOMPLETE — zero-leaf windows: ${mapResult.incompleteWindows.join(', ')}. Re-run map; a partial map must never seed the pipeline.`,
      ),
    );
  }
  return ok(mapResult);
}

function successfulReduce(reduceResult: ReduceResult): Result<ReduceSuccess, Error> {
  return reduceResult.ok
    ? ok(reduceResult)
    : err(new Error(`reduce stage failed: ${reduceResult.error}`));
}

function successfulValidates(
  validateResults: readonly ValidateResult[],
): Result<readonly ValidateSuccess[], Error> {
  const successes: ValidateSuccess[] = [];
  for (const result of validateResults) {
    if (!result.ok) {
      return err(new Error(`a validate result in the set failed: ${result.error}`));
    }
    successes.push(result);
  }
  return ok(successes);
}

/** Derive the reduce stage's run data from a committed, COMPLETE map result. */
export function reduceRunDataFrom(mapResult: MapResult): Result<ReduceRunData, Error> {
  const map = completeMap(mapResult);
  if (!map.ok) {
    return map;
  }
  return ok({ leaves: map.value.leaves });
}

/**
 * Derive the validate stage's run data: candidates from reduce, the grounding-leaf
 * projection from map, resume ids from the prior validate results, and the explicit
 * token ceiling.
 */
export function validateRunDataFrom(input: {
  readonly mapResult: MapResult;
  readonly reduceResult: ReduceResult;
  readonly priorValidateResults: readonly ValidateResult[];
  readonly validateTokenCeiling: number;
}): Result<ValidateRunData, Error> {
  const map = completeMap(input.mapResult);
  if (!map.ok) {
    return map;
  }
  const reduce = successfulReduce(input.reduceResult);
  if (!reduce.ok) {
    return reduce;
  }
  const priors = successfulValidates(input.priorValidateResults);
  if (!priors.ok) {
    return priors;
  }
  return ok({
    candidates: reduce.value.candidates,
    groundingLeaves: map.value.leaves.map((leaf) => ({
      id: leaf.id,
      window: leaf.window,
      grounding: leaf.grounding,
    })),
    resolvedIds: priors.value.flatMap((result) => result.resolvedCandidateIds),
    validateTokenCeiling: input.validateTokenCeiling,
  });
}

function mergeTerminalDispositions(
  validates: readonly ValidateSuccess[],
): Result<ReadonlyMap<string, Disposition>, Error> {
  const merged = new Map<string, Disposition>();
  for (const result of validates) {
    for (const entry of result.dispositions) {
      if (entry.disposition === 'held-for-review') {
        continue; // a hold is resolved by a later result or caught as missing below
      }
      const existing = merged.get(entry.candidateId);
      if (existing !== undefined && existing !== entry.disposition) {
        return err(
          new Error(
            `candidate ${entry.candidateId} has conflicting terminal dispositions across validate results: ${existing} vs ${entry.disposition}`,
          ),
        );
      }
      merged.set(entry.candidateId, entry.disposition);
    }
  }
  return ok(merged);
}

function dispositionCandidates(
  candidates: ReduceSuccess['candidates'],
  merged: ReadonlyMap<string, Disposition>,
): Result<DispositionedCandidate[], Error> {
  const dispositioned: DispositionedCandidate[] = [];
  const unresolved: string[] = [];
  for (const candidate of candidates) {
    const disposition = merged.get(candidate.id);
    if (disposition === undefined || disposition === 'held-for-review') {
      unresolved.push(candidate.id);
      continue;
    }
    dispositioned.push({
      id: candidate.id,
      pattern: candidate.pattern,
      kind: candidate.kind,
      isAbsenceClaim: candidate.isAbsenceClaim,
      supportingWindows: candidate.supportingWindows,
      disposition,
    });
  }
  if (unresolved.length > 0) {
    return err(
      new Error(
        `candidates without a terminal disposition: ${unresolved.join(', ')} — resume validate over the unresolved tail before running meta.`,
      ),
    );
  }
  return ok(dispositioned);
}

/**
 * Derive the meta stage's run data by merging every validate result's terminal
 * dispositions onto the reduce candidates — the pre-meta hard gate, structural.
 */
export function metaRunDataFrom(input: {
  readonly reduceResult: ReduceResult;
  readonly validateResults: readonly ValidateResult[];
}): Result<MetaRunData, Error> {
  const reduce = successfulReduce(input.reduceResult);
  if (!reduce.ok) {
    return reduce;
  }
  const validates = successfulValidates(input.validateResults);
  if (!validates.ok) {
    return validates;
  }
  const merged = mergeTerminalDispositions(validates.value);
  if (!merged.ok) {
    return merged;
  }

  const candidateIds = new Set(reduce.value.candidates.map((candidate) => candidate.id));
  const unknown = [...merged.value.keys()].filter((id) => !candidateIds.has(id));
  if (unknown.length > 0) {
    return err(new Error(`dispositions name unknown candidate ids: ${unknown.join(', ')}`));
  }

  const candidates = dispositionCandidates(reduce.value.candidates, merged.value);
  return candidates.ok ? ok({ candidates: candidates.value }) : candidates;
}
