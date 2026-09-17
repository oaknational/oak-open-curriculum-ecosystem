import { err, isErr, ok, type Result } from '@oaknational/result';

import type { ConstructCount, ConstructDefinition, TypeTruthCount } from './analysis-model.js';
import type { ConstructTotal } from './document-model.js';
import { EstateReviewError } from './errors.js';
import { TYPE_TRUTH_IDS, type DeliveryState, type Provenance } from './file-vocabulary.js';
import type { RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

export interface TotalsFileState {
  readonly path: RepoPath;
  readonly parseStatus: 'parsed' | 'parsed-with-diagnostics' | 'not-attempted';
  readonly provenance: Provenance;
  readonly verificationOnly: DeliveryState;
  readonly constructCounts: readonly ConstructCount[];
  readonly typeTruthCounts: readonly TypeTruthCount[];
}

export interface TotalsSemanticInput {
  readonly definitions: readonly ConstructDefinition[];
  readonly files: readonly TotalsFileState[];
  readonly constructTotals: readonly ConstructTotal[];
  readonly typeTruthTotals: readonly TypeTruthCount[];
}

/** Recompute construct and type-truth totals from their ordered per-file observations. */
export function validateTotalsSemantics(
  input: TotalsSemanticInput,
): Result<undefined, EstateReviewError> {
  const definitions = validateDefinitions(input.definitions);
  if (isErr(definitions)) {
    return definitions;
  }
  const files = validateFileCounts(input.files, input.definitions);
  if (isErr(files)) {
    return files;
  }
  const constructs = validateConstructTotals(input);
  if (isErr(constructs)) {
    return constructs;
  }
  return validateTypeTruthTotals(input);
}

function validateDefinitions(
  definitions: readonly ConstructDefinition[],
): Result<undefined, EstateReviewError> {
  const ids = definitions.map(({ id }) => id);
  if (new Set(ids).size !== ids.length) {
    return invalid('construct definition ids are not unique');
  }
  const sorted = [...definitions].sort(compareDefinitions);
  return definitions.every((definition, index) => definition === sorted[index])
    ? ok(undefined)
    : invalid('construct definitions are not in class/id order');
}

function compareDefinitions(left: ConstructDefinition, right: ConstructDefinition): number {
  return classRank(left.class) - classRank(right.class) || compareUtf16(left.id, right.id);
}

function classRank(value: ConstructDefinition['class']): number {
  if (value === 'runtime-value-structure') {
    return 0;
  }
  if (value === 'type-model-structure') {
    return 1;
  }
  return 2;
}

function validateFileCounts(
  files: readonly TotalsFileState[],
  definitions: readonly ConstructDefinition[],
): Result<undefined, EstateReviewError> {
  const definitionIds = definitions.map(({ id }) => id);
  for (const file of files) {
    if (file.parseStatus === 'not-attempted') {
      if (file.constructCounts.length > 0 || file.typeTruthCounts.length > 0) {
        return invalid(`non-parsed file '${file.path}' has analysis counts`);
      }
      continue;
    }
    if (!sameIds(file.constructCounts, definitionIds)) {
      return invalid(`construct counts do not match definitions for '${file.path}'`);
    }
    if (!sameIds(file.typeTruthCounts, TYPE_TRUTH_IDS)) {
      return invalid(`type-truth counts are not in vocabulary order for '${file.path}'`);
    }
  }
  return ok(undefined);
}

function sameIds(
  records: readonly { readonly id: string }[],
  expectedIds: readonly string[],
): boolean {
  return (
    records.length === expectedIds.length &&
    records.every(({ id }, index) => id === expectedIds[index])
  );
}

function validateConstructTotals(input: TotalsSemanticInput): Result<undefined, EstateReviewError> {
  if (
    !sameIds(
      input.constructTotals,
      input.definitions.map(({ id }) => id),
    )
  ) {
    return invalid('construct totals do not match definition order');
  }
  for (const asserted of input.constructTotals) {
    const expected = recomputeConstructTotal(asserted.id, input.files);
    if (!sameConstructTotal(asserted, expected)) {
      return invalid(`construct total '${asserted.id}' does not match per-file counts`);
    }
  }
  return ok(undefined);
}

function recomputeConstructTotal(id: string, files: readonly TotalsFileState[]): ConstructTotal {
  const total = emptyConstructTotal(id);
  for (const file of files) {
    const count = file.constructCounts.find((entry) => entry.id === id)?.count ?? 0;
    total.total += count;
    total[PROVENANCE_FIELDS[file.provenance]] += count;
    total[VERIFICATION_FIELDS[file.verificationOnly]] += count;
  }
  return total;
}

type MutableConstructTotal = { -readonly [K in keyof ConstructTotal]: ConstructTotal[K] };

function emptyConstructTotal(id: string): MutableConstructTotal {
  return {
    id,
    total: 0,
    authored: 0,
    generatedConfirmed: 0,
    generatedDeclaredUnconfirmed: 0,
    imported: 0,
    unknown: 0,
    verificationOnly: 0,
    nonVerification: 0,
    verificationUnresolved: 0,
  };
}

const PROVENANCE_FIELDS = {
  authored: 'authored',
  'generated-confirmed': 'generatedConfirmed',
  'generated-declared-unconfirmed': 'generatedDeclaredUnconfirmed',
  imported: 'imported',
  unknown: 'unknown',
} as const satisfies Readonly<Record<Provenance, keyof ConstructTotal>>;

const VERIFICATION_FIELDS = {
  present: 'verificationOnly',
  absent: 'nonVerification',
  ambiguous: 'verificationUnresolved',
  'not-probed': 'verificationUnresolved',
} as const satisfies Readonly<Record<DeliveryState, keyof ConstructTotal>>;

const TOTAL_FIELDS = [
  'id',
  'total',
  'authored',
  'generatedConfirmed',
  'generatedDeclaredUnconfirmed',
  'imported',
  'unknown',
  'verificationOnly',
  'nonVerification',
  'verificationUnresolved',
] as const satisfies readonly (keyof ConstructTotal)[];

function sameConstructTotal(left: ConstructTotal, right: ConstructTotal): boolean {
  return TOTAL_FIELDS.every((field) => left[field] === right[field]);
}

function validateTypeTruthTotals(input: TotalsSemanticInput): Result<undefined, EstateReviewError> {
  if (!sameIds(input.typeTruthTotals, TYPE_TRUTH_IDS)) {
    return invalid('type-truth totals are not in vocabulary order');
  }
  for (const asserted of input.typeTruthTotals) {
    const expected = input.files.reduce(
      (sum, file) =>
        sum + (file.typeTruthCounts.find((entry) => entry.id === asserted.id)?.count ?? 0),
      0,
    );
    if (asserted.count !== expected) {
      return invalid(`type-truth total '${asserted.id}' does not match per-file counts`);
    }
  }
  return ok(undefined);
}

function invalid(message: string): Result<never, EstateReviewError> {
  return err(new EstateReviewError('VALIDATION_FAILED', message));
}
