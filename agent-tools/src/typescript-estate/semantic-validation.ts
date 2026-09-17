import { err, isErr, ok, type Result } from '@oaknational/result';

import type { CoverageRecord } from './document-model.js';
import { EstateReviewError } from './errors.js';
import type { FileRecord } from './file-model.js';
import { digestOrderedPaths } from './path-coverage-digest.js';
import type { RepoPath } from './scalar-model.js';

export {
  type AuxiliaryReadObservation,
  type AuxiliaryReadSemanticInput,
  validateAuxiliaryReadSemantics,
} from './semantic-auxiliary-validation.js';

export {
  type TotalsFileState,
  type TotalsSemanticInput,
  validateTotalsSemantics,
} from './semantic-totals-validation.js';

export {
  type ClassificationSemanticFile,
  type ClassificationSemanticInput,
  validateClassificationSemantics,
} from './semantic-classification-validation.js';

export interface CoverageFileState {
  readonly path: RepoPath;
  readonly readStatus: FileRecord['read']['status'];
  readonly parseStatus: FileRecord['parseStatus'];
}

export interface CoverageSemanticInput {
  readonly coverage: CoverageRecord;
  readonly files: readonly CoverageFileState[];
}

/** Validate the complete denominator independently from its asserted totals. */
export function validateCoverageSemantics(
  input: CoverageSemanticInput,
): Result<undefined, EstateReviewError> {
  const paths = input.files.map((file) => file.path);
  const digest = digestOrderedPaths(paths);
  if (isErr(digest)) {
    return digest;
  }
  const actual = countFileStates(input.files);
  const denominator = validateDenominator(input);
  if (isErr(denominator)) {
    return denominator;
  }
  const reads = validateReadTotals(input.coverage, actual);
  if (isErr(reads)) {
    return reads;
  }
  const parses = validateParseTotals(input.coverage, actual);
  if (isErr(parses)) {
    return parses;
  }
  const states = validateFileStatePairs(input.files);
  if (isErr(states)) {
    return states;
  }
  if (digest.value !== input.coverage.pathsSha256) {
    return invalid('pathsSha256 does not match the ordered denominator');
  }
  return ok(undefined);
}

type FileStateCounts = ReturnType<typeof countFileStates>;

function validateDenominator(input: CoverageSemanticInput): Result<undefined, EstateReviewError> {
  return input.coverage.denominator === input.files.length
    ? ok(undefined)
    : invalid('denominator does not equal files.length');
}

function validateReadTotals(
  coverage: CoverageRecord,
  actual: FileStateCounts,
): Result<undefined, EstateReviewError> {
  const assertedTotal = coverage.readable + coverage.invalidUtf8 + coverage.unsupportedModes;
  if (assertedTotal !== coverage.denominator) {
    return invalid('read-status partition does not equal denominator');
  }
  return actual.readable === coverage.readable &&
    actual.invalidUtf8 === coverage.invalidUtf8 &&
    actual.unsupportedModes === coverage.unsupportedModes
    ? ok(undefined)
    : invalid('read-status counts do not equal file states');
}

function validateParseTotals(
  coverage: CoverageRecord,
  actual: FileStateCounts,
): Result<undefined, EstateReviewError> {
  if (coverage.parsed !== coverage.readable) {
    return invalid('parsed does not equal readable files');
  }
  if (actual.parsed !== coverage.parsed) {
    return invalid('parsed does not equal file states');
  }
  if (actual.parsedWithDiagnostics !== coverage.parsedWithDiagnostics) {
    return invalid('parsedWithDiagnostics does not equal file states');
  }
  return coverage.parsedWithDiagnostics <= coverage.parsed
    ? ok(undefined)
    : invalid('parsedWithDiagnostics exceeds parsed');
}

function validateFileStatePairs(
  files: readonly CoverageFileState[],
): Result<undefined, EstateReviewError> {
  const inconsistent = files.find(
    (file) =>
      (file.readStatus === 'read' && file.parseStatus === 'not-attempted') ||
      (file.readStatus !== 'read' && file.parseStatus !== 'not-attempted'),
  );
  return inconsistent === undefined
    ? ok(undefined)
    : invalid(`read and parse states disagree for '${inconsistent.path}'`);
}

function countFileStates(files: readonly CoverageFileState[]): {
  readonly readable: number;
  readonly invalidUtf8: number;
  readonly unsupportedModes: number;
  readonly parsed: number;
  readonly parsedWithDiagnostics: number;
} {
  let readable = 0;
  let invalidUtf8 = 0;
  let unsupportedModes = 0;
  let parsed = 0;
  let parsedWithDiagnostics = 0;

  for (const file of files) {
    if (file.readStatus === 'read') {
      readable += 1;
    } else if (file.readStatus === 'invalid-utf8') {
      invalidUtf8 += 1;
    } else {
      unsupportedModes += 1;
    }
    if (file.parseStatus === 'parsed' || file.parseStatus === 'parsed-with-diagnostics') {
      parsed += 1;
    }
    if (file.parseStatus === 'parsed-with-diagnostics') {
      parsedWithDiagnostics += 1;
    }
  }
  return { readable, invalidUtf8, unsupportedModes, parsed, parsedWithDiagnostics };
}

function invalid(message: string): Result<never, EstateReviewError> {
  return err(new EstateReviewError('VALIDATION_FAILED', message));
}
