import { isErr, ok, type Result } from '@oaknational/result';

import type { EstateReviewError } from './errors.js';
import {
  classifyPreparedSnapshotFiles,
  type FileClassificationProgram,
} from './file-classification-engine.js';
import type { ClassifiedSnapshotSource } from './file-classification-model.js';
export type { ClassifiedSnapshotSource, FileClassification } from './file-classification-model.js';
import { preflightGeneratedOutputRules } from './generated-output-rules.js';
import type { GitSourceSnapshot } from './git-snapshot-model.js';
import { createProvenanceClassifier } from './provenance-classification.js';
import { createRoleClassifier } from './role-classification.js';
import { discoverWorkspaces } from './workspace-manifest.js';
import type { ValidatedDetectorConfig } from './validated-detector-config.js';

/** Pinned snapshot and nominal whole-contract capability required by the production facade. */
export interface ClassifySnapshotFilesInput {
  readonly snapshot: GitSourceSnapshot;
  readonly config: ValidatedDetectorConfig;
}

/**
 * Compose only the revision 2.6 classification fragment over pinned sources.
 *
 * Delivery and complete FileRecord assembly remain deliberately impossible at
 * this boundary while their later contract slices are held.
 */
export function classifySnapshotFiles(
  input: ClassifySnapshotFilesInput,
): Result<readonly ClassifiedSnapshotSource[], EstateReviewError> {
  const prepared = prepareClassification(input);
  return isErr(prepared)
    ? prepared
    : classifyPreparedSnapshotFiles({ files: input.snapshot.files, program: prepared.value });
}

function prepareClassification(
  input: ClassifySnapshotFilesInput,
): Result<FileClassificationProgram, EstateReviewError> {
  const config = input.config.classification();
  const workspaces = discoverWorkspaces({
    config: config.workspaceAttribution,
    treeEntries: input.snapshot.treeEntries,
    auxiliary: input.snapshot.auxiliary,
  });
  if (isErr(workspaces)) {
    return workspaces;
  }
  const generatedRules = preflightGeneratedOutputRules(
    config.generatedOutputRules,
    input.snapshot.treeEntries,
  );
  if (isErr(generatedRules)) {
    return generatedRules;
  }
  const provenance = createProvenanceClassifier(
    config.provenanceClassification,
    generatedRules.value,
  );
  if (isErr(provenance)) {
    return provenance;
  }
  const roles = createRoleClassifier(config.roleRules);
  if (isErr(roles)) {
    return roles;
  }
  return ok({ workspaces: workspaces.value, provenance: provenance.value, roles: roles.value });
}
