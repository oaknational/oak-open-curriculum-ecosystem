import type { SourceFile } from 'typescript';

import type { Result } from '@oaknational/result';

import type { AuxiliaryReadRecord, SnapshotRecord } from './document-model.js';
import type { AuxiliaryBlobReadRefusal, EstateReviewError } from './errors.js';
import type { InvalidUtf8Read, ReadSuccess, TreeEntry, UnsupportedModeRead } from './file-model.js';
import type { ProcessPort } from './ports.js';
import type { RepoPath, Sha256 } from './scalar-model.js';

export const SOURCE_EXTENSIONS = ['.ts', '.tsx'] as const;

/** Resource limits needed while taking the pinned source snapshot. */
export interface GitSnapshotLimits {
  readonly maxTrackedPaths: number;
  readonly maxTreeListingBytes: number;
  readonly maxGitStderrBytes: number;
  readonly maxTotalSourceBytes: number;
  readonly maxSourceBytesPerFile: number;
  readonly maxTotalAuxiliaryBlobBytes: number;
  readonly maxAuxiliaryBlobBytesPerFile: number;
}

/** Canonical-path capability injected independently from Git execution. */
export interface SnapshotPathPort {
  canonicalRealpath(pathValue: string): string;
}

interface SnapshotFileBase {
  readonly path: RepoPath;
  readonly extension: (typeof SOURCE_EXTENSIONS)[number];
  readonly treeEntry: TreeEntry;
}

/** A regular source blob decoded from the pinned Git object database. */
export interface ReadableSnapshotSource extends SnapshotFileBase {
  readonly bytes: Uint8Array;
  readonly text: string;
  readonly sourceFile: SourceFile;
  readonly read: ReadSuccess;
}

/** A regular source blob whose exact bytes are not valid UTF-8. */
export interface InvalidUtf8SnapshotSource extends SnapshotFileBase {
  readonly bytes: Uint8Array;
  readonly read: InvalidUtf8Read;
}

/** A TypeScript path retained but not readable as a regular blob. */
export interface UnsupportedSnapshotSource extends SnapshotFileBase {
  readonly read: UnsupportedModeRead;
}

export type SnapshotSource =
  ReadableSnapshotSource | InvalidUtf8SnapshotSource | UnsupportedSnapshotSource;

/** A tree entry that Git can expose as uninterpreted pinned bytes. */
export type RegularBlobTreeEntry = TreeEntry & {
  readonly mode: '100644' | '100755';
  readonly type: 'blob';
  readonly size: number;
};

/** One successful pinned blob read returned to a caller as defensive bytes. */
export interface AuxiliaryBlobRead {
  readonly path: RepoPath;
  readonly treeEntry: RegularBlobTreeEntry;
  readonly bytes: Uint8Array;
  readonly byteCount: number;
  readonly contentSha256: Sha256;
}

/** Exact cached non-TypeScript bytes used to recompute the auxiliary ledger. */
export interface AuxiliaryBlobReadObservation {
  readonly path: RepoPath;
  readonly treeEntry: RegularBlobTreeEntry;
  readonly bytes: Uint8Array;
}

/**
 * Semantic pinned-blob access: exact bytes of one tracked path at the pinned
 * commit, never the working tree. The commit binding lives in the adapter, so
 * a reader holding this port cannot name any other revision.
 */
export interface PinnedBlobReadPort {
  read(path: RepoPath, maxBytes: number): Result<Uint8Array, EstateReviewError>;
}

/** Run-scoped access to regular blobs in the already validated pinned tree. */
export interface GitSnapshotAuxiliaryReader {
  /** Read one exact path as defensive uninterpreted bytes or a typed failure. */
  read(path: RepoPath): Result<AuxiliaryBlobRead, EstateReviewError | AuxiliaryBlobReadRefusal>;

  /** Project successful unique non-TypeScript reads into the frozen output record. */
  ledger(): Result<readonly AuxiliaryReadRecord[], EstateReviewError>;

  /** Expose defensive exact-byte copies for independent semantic recomputation. */
  observations(): Result<readonly AuxiliaryBlobReadObservation[], EstateReviewError>;
}

/** Complete deterministic source snapshot used by later extractor stages. */
export interface GitSourceSnapshot {
  readonly invokingGitRoot: string;
  readonly record: SnapshotRecord;
  readonly treeEntries: readonly TrackedTreeEntry[];
  readonly files: readonly SnapshotSource[];
  readonly auxiliary: GitSnapshotAuxiliaryReader;
}

export interface CaptureGitSnapshotInput {
  readonly callerCwd: string;
  readonly inputRef: string;
  readonly gitExecutable: string;
  readonly inheritedEnvironment: NodeJS.ProcessEnv;
  readonly limits: GitSnapshotLimits;
  readonly process: ProcessPort;
  readonly paths: SnapshotPathPort;
}

export interface GitContext {
  readonly executable: string;
  readonly cwd: string;
  readonly root: string;
  readonly env: Readonly<Record<string, string>>;
  readonly stderrLimit: number;
  readonly process: ProcessPort;
}

export interface TrackedTreeEntry {
  readonly path: RepoPath;
  readonly treeEntry: TreeEntry;
}

export interface ParsedTreeSource extends TrackedTreeEntry {
  readonly extension: (typeof SOURCE_EXTENSIONS)[number];
}

export interface GitTreeEnumeration {
  readonly treeEntries: readonly TrackedTreeEntry[];
  readonly sources: readonly ParsedTreeSource[];
}
