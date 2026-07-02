/**
 * Sandbox-side run-data guards — defence in depth at the artefact boundary.
 *
 * @remarks
 * Run data reaches an artefact only through `build-run-artefact`, which fully validates
 * it with the zod stage contracts (`stage-io.ts`) BEFORE inlining, and tags it with the
 * stage it was validated FOR (the `RUN_DATA_STAGE` discriminant). These guards are the
 * in-sandbox second line: the discriminant check catches an unseeded artefact (the
 * `run-data.ts` sentinel) or a wrong-stage seeding exactly, and the shallow structural
 * checks catch a malformed substitution — without dragging zod into the bundle. Their
 * type predicates promise the full stage type on the strength of that pipeline
 * invariant: the deep validation has already happened, on the same data, for the same
 * stage, at the Node boundary.
 *
 * Pure functions with no value imports — safe to inline into any artefact.
 *
 * @packageDocumentation
 */

import type { MapRunData, MetaRunData, ReduceRunData, ValidateRunData } from './stage-io.js';

function nonEmptyArray(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

/** Map run data: tagged for map, with a non-empty window partition. */
export function isMapRunData(value: unknown, stage: string): value is MapRunData {
  return (
    stage === 'map' &&
    typeof value === 'object' &&
    value !== null &&
    'windows' in value &&
    nonEmptyArray(value.windows)
  );
}

/** Reduce run data: tagged for reduce, with non-empty leaves. */
export function isReduceRunData(value: unknown, stage: string): value is ReduceRunData {
  return (
    stage === 'reduce' &&
    typeof value === 'object' &&
    value !== null &&
    'leaves' in value &&
    nonEmptyArray(value.leaves)
  );
}

function hasValidateArrays(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'candidates' in value &&
    nonEmptyArray(value.candidates) &&
    'groundingLeaves' in value &&
    nonEmptyArray(value.groundingLeaves) &&
    'resolvedIds' in value &&
    Array.isArray(value.resolvedIds)
  );
}

function hasExplicitCeiling(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'validateTokenCeiling' in value &&
    typeof value.validateTokenCeiling === 'number' &&
    value.validateTokenCeiling > 0
  );
}

/** Validate run data: tagged for validate, with candidates + grounding + explicit ceiling. */
export function isValidateRunData(value: unknown, stage: string): value is ValidateRunData {
  return stage === 'validate' && hasValidateArrays(value) && hasExplicitCeiling(value);
}

/** Meta run data: tagged for meta, with non-empty terminally-dispositioned candidates. */
export function isMetaRunData(value: unknown, stage: string): value is MetaRunData {
  return (
    stage === 'meta' &&
    typeof value === 'object' &&
    value !== null &&
    'candidates' in value &&
    nonEmptyArray(value.candidates)
  );
}

/** The uniform message an unseeded or wrong-stage artefact fails with. */
export function unseededRunDataError(stage: string): string {
  return `${stage} run data has the wrong shape or stage tag — this artefact is unseeded or seeded for a different stage; build it with build-run-artefact.`;
}
