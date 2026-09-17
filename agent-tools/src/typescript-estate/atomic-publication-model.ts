import type { Result } from '@oaknational/result';

/** Containment state prepared by the repository's established write guard. */
export interface PreparedPublicationTarget {
  readonly outDirectory: string;
}

/** Filesystem kinds relevant to refusing a symlink final target. */
export type PublicationFileKind = 'file' | 'directory' | 'symlink' | 'other';

/** The fixed final artefact; cleanup operations cannot accept this type. */
export interface FinalPublicationTarget {
  readonly kind: 'final-publication-target';
  readonly path: string;
}

/** The exclusive sibling temp; only this type can be cleaned up. */
export interface TemporaryPublicationTarget {
  readonly kind: 'temporary-publication-target';
  readonly path: string;
}

/** Phase-specific contained atomic-file operations. */
export interface AtomicPublicationPort<Handle> {
  prepareContainedTarget(
    invokingGitRoot: string,
    outDirectory: string,
  ): Result<PreparedPublicationTarget, Error>;
  checkBeforeCreate(target: PreparedPublicationTarget): Result<void, Error>;
  materialiseDirectory(target: PreparedPublicationTarget): Result<void, Error>;
  inspectTargetBeforeCreate(
    target: FinalPublicationTarget,
  ): Result<PublicationFileKind | undefined, Error>;
  createExclusive(target: TemporaryPublicationTarget): Result<Handle, Error>;
  write(handle: Handle, bytes: Uint8Array): Result<void, Error>;
  fsync(handle: Handle): Result<void, Error>;
  close(handle: Handle): Result<void, Error>;
  checkBeforeCommit(target: PreparedPublicationTarget): Result<void, Error>;
  inspectTargetBeforeCommit(
    target: FinalPublicationTarget,
  ): Result<PublicationFileKind | undefined, Error>;
  rename(temp: TemporaryPublicationTarget, final: FinalPublicationTarget): Result<void, Error>;
  removeTemp(target: TemporaryPublicationTarget): Result<void, Error>;
}

/** Validated value, resource bound, token, and phase-specific publication capability. */
export interface PublishRawExtractionInput<Value, Handle> {
  readonly invokingGitRoot: string;
  readonly outDirectory: string;
  readonly value: Value;
  readonly maxSerializedOutputBytes: number;
  readonly tempToken: string;
  readonly validate: (value: Value) => Result<Value, Error>;
  readonly publication: AtomicPublicationPort<Handle>;
}

/** Exact bytes and fixed path committed by a successful publication. */
export interface PublishedRawExtraction {
  readonly outputPath: string;
  readonly bytes: Uint8Array;
}
