import { isErr, ok, type Result } from '@oaknational/result';

import type { EstateReviewError } from './errors.js';
import type { ClassifiedSnapshotSource, FileClassification } from './file-classification-model.js';
import type { WorkspaceRecord } from './file-model.js';
import type { SnapshotSource } from './git-snapshot-model.js';
import type { ProvenanceClassifier } from './provenance-classification.js';
import type { RoleClassifier } from './role-classification.js';
import { attributeWorkspace } from './workspace-attribution.js';

/**
 * Internal executable mechanics.
 *
 * The ESLint import fence permits this module only from the validated facade
 * and colocated tests. It is not a production alternative to detector ingress.
 */
export interface FileClassificationProgram {
  readonly workspaces: readonly WorkspaceRecord[];
  readonly provenance: ProvenanceClassifier;
  readonly roles: RoleClassifier;
}

/** Internal prepared program and pinned source observations to classify. */
export interface ClassifyPreparedSnapshotFilesInput {
  readonly files: readonly SnapshotSource[];
  readonly program: FileClassificationProgram;
}

/** Apply already-prepared mechanics to pinned source observations. */
export function classifyPreparedSnapshotFiles(
  input: ClassifyPreparedSnapshotFilesInput,
): Result<readonly ClassifiedSnapshotSource[], EstateReviewError> {
  const classified: ClassifiedSnapshotSource[] = [];
  for (const source of input.files) {
    const classification = classifySource(source, input.program);
    if (isErr(classification)) {
      return classification;
    }
    classified.push({ source, classification: classification.value });
  }
  return ok(classified);
}

function classifySource(
  source: SnapshotSource,
  program: FileClassificationProgram,
): Result<FileClassification, EstateReviewError> {
  const workspace = attributeWorkspace(source.path, program.workspaces);
  if (isErr(workspace)) {
    return workspace;
  }
  const sourceText = 'text' in source ? source.text : null;
  const provenance = program.provenance.classify({ path: source.path, sourceText });
  const sourceFile = 'sourceFile' in source ? source.sourceFile : null;
  const roles = program.roles.classify({
    path: source.path,
    provenance: provenance.provenance,
    sourceFile,
  });
  return ok({
    workspace: workspace.value,
    provenance: provenance.provenance,
    provenanceSignals: provenance.signals,
    roles,
  });
}
