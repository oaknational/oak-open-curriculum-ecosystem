import type { ProvenanceSignal, WorkspaceRecord } from './file-model.js';
import type { FileRole, Provenance } from './file-vocabulary.js';
import type { SnapshotSource } from './git-snapshot-model.js';
import type { NonEmptyReadonlyArray } from './scalar-model.js';

/** The contract-ready classification fields that precede held delivery logic. */
export interface FileClassification {
  readonly workspace: WorkspaceRecord | null;
  readonly provenance: Provenance;
  readonly provenanceSignals: readonly ProvenanceSignal[];
  readonly roles: NonEmptyReadonlyArray<FileRole>;
}

/** One pinned source paired with its contract-ready classification fragment. */
export interface ClassifiedSnapshotSource {
  readonly source: SnapshotSource;
  readonly classification: FileClassification;
}
