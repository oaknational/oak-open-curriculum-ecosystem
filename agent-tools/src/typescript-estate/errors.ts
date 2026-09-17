import type { TreeEntry } from './file-model.js';
import type { RepoPath } from './scalar-model.js';

/** Stable failure codes emitted by the TypeScript estate extractor. */
export type EstateErrorCode =
  | 'CLI_INVALID'
  | 'CONFIG_INVALID'
  | 'IDENTITY_INVALID'
  | 'RESOURCE_LIMIT'
  | 'SNAPSHOT_INVALID'
  | 'SOURCE_READ_FAILED'
  | 'VALIDATION_FAILED'
  | 'PUBLICATION_FAILED';

/** A deliberately typed, user-safe extractor failure. */
export class EstateReviewError extends Error {
  readonly code: EstateErrorCode;

  constructor(code: EstateErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'EstateReviewError';
    this.code = code;
  }
}

/** Preserve typed failures and wrap unknown causes at one boundary. */
export function estateError(
  code: EstateErrorCode,
  message: string,
  cause?: unknown,
): EstateReviewError {
  if (cause instanceof EstateReviewError) {
    return cause;
  }
  return new EstateReviewError(code, message, cause === undefined ? undefined : { cause });
}

/** A requested path that is absent from the validated pinned-tree index. */
export class MissingAuxiliaryBlobRefusal extends Error {
  readonly kind = 'missing-path';
  readonly path: RepoPath;

  constructor(path: RepoPath) {
    super(`auxiliary blob path '${path}' is absent from the pinned tree`);
    this.name = 'MissingAuxiliaryBlobRefusal';
    this.path = path;
  }
}

/** A pinned-tree entry that cannot be read as a regular auxiliary blob. */
export class NonRegularAuxiliaryBlobRefusal extends Error {
  readonly kind = 'nonregular-entry';
  readonly path: RepoPath;
  readonly treeEntry: TreeEntry;

  constructor(path: RepoPath, treeEntry: TreeEntry) {
    super(`auxiliary blob path '${path}' is not a 100644 or 100755 blob with a declared size`);
    this.name = 'NonRegularAuxiliaryBlobRefusal';
    this.path = path;
    this.treeEntry = { ...treeEntry };
  }
}

/** Typed, non-operational reasons why an auxiliary path cannot be read. */
export type AuxiliaryBlobReadRefusal = MissingAuxiliaryBlobRefusal | NonRegularAuxiliaryBlobRefusal;
