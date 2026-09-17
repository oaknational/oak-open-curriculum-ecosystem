import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import { classifySnapshotFiles } from './file-classification.js';
import type { FileClassification } from './file-classification-model.js';
import type { ProvenanceSignal, WorkspaceRecord } from './file-model.js';
import type { GitSourceSnapshot, SnapshotSource } from './git-snapshot-model.js';
import type { RepoPath } from './scalar-model.js';
import type { ValidatedDetectorConfig } from './validated-detector-config.js';

/** One independently asserted classification, identified by pinned repository path. */
export interface ClassificationSemanticFile {
  readonly path: RepoPath;
  readonly classification: FileClassification;
}

/** Production semantic-validation input bound to a nominal whole-contract capability. */
export interface ClassificationSemanticInput {
  readonly snapshot: GitSourceSnapshot;
  readonly config: ValidatedDetectorConfig;
  readonly assertedFiles: readonly ClassificationSemanticFile[];
}

/** Reparse pinned inputs and compare the complete revision 2.6 fragment. */
export function validateClassificationSemantics(
  input: ClassificationSemanticInput,
): Result<undefined, EstateReviewError> {
  const recomputed = classifySnapshotFiles({ snapshot: input.snapshot, config: input.config });
  if (isErr(recomputed)) {
    return recomputed;
  }
  return compareClassificationSemantics(recomputed.value, input.assertedFiles);
}

/** Compare an independently asserted fragment with already-recomputed results. */
export function compareClassificationSemantics(
  recomputed: readonly {
    readonly source: SnapshotSource;
    readonly classification: FileClassification;
  }[],
  assertedFiles: readonly ClassificationSemanticFile[],
): Result<undefined, EstateReviewError> {
  if (recomputed.length !== assertedFiles.length) {
    return invalid('classification does not match pinned recomputation: file count differs');
  }
  for (let index = 0; index < recomputed.length; index += 1) {
    const expected = recomputed[index];
    const asserted = assertedFiles[index];
    if (expected === undefined || asserted === undefined) {
      return invalid('classification does not match pinned recomputation: file count differs');
    }
    if (
      expected.source.path !== asserted.path ||
      !sameClassification(expected.classification, asserted.classification)
    ) {
      return invalid(
        `classification does not match pinned recomputation at index ${String(index)} for '${asserted.path}'`,
      );
    }
  }
  return ok(undefined);
}

function sameClassification(left: FileClassification, right: FileClassification): boolean {
  return (
    sameWorkspace(left.workspace, right.workspace) &&
    left.provenance === right.provenance &&
    sameSignals(left.provenanceSignals, right.provenanceSignals) &&
    sameStrings(left.roles, right.roles)
  );
}

function sameWorkspace(left: WorkspaceRecord | null, right: WorkspaceRecord | null): boolean {
  if (left === null || right === null) {
    return left === right;
  }
  return (
    left.root === right.root && left.name === right.name && left.manifestPath === right.manifestPath
  );
}

function sameSignals(
  left: readonly ProvenanceSignal[],
  right: readonly ProvenanceSignal[],
): boolean {
  return (
    left.length === right.length &&
    left.every((signal, index) => {
      const candidate = right[index];
      return candidate !== undefined && sameSignal(signal, candidate);
    })
  );
}

function sameSignal(left: ProvenanceSignal, right: ProvenanceSignal): boolean {
  return sameScalarSequence(signalIdentity(left), signalIdentity(right));
}

function signalIdentity(signal: ProvenanceSignal): readonly (string | number)[] {
  if (signal.kind === 'generated-path') {
    return [signal.kind, signal.matcherId, signal.evidencePath];
  }
  if (signal.kind === 'generated-header') {
    return [
      signal.kind,
      signal.matcherId,
      signal.evidencePath,
      signal.startOffset,
      signal.endOffset,
    ];
  }
  if (signal.kind === 'producer-output-rule') {
    return [signal.kind, signal.ruleId, ...signal.producerEvidencePaths];
  }
  return [signal.kind, signal.ruleId, signal.evidencePath];
}

function sameScalarSequence(
  left: readonly (string | number)[],
  right: readonly (string | number)[],
): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function invalid(message: string): Result<never, EstateReviewError> {
  return err(new EstateReviewError('VALIDATION_FAILED', message));
}
