import type { Result } from '@oaknational/result';

/** File kinds needed to prove an identity member is a real regular file. */
export type IdentityFileKind = 'directory' | 'file' | 'symlink' | 'other';

/**
 * One filesystem node observed without following links: its kind plus the
 * device/inode identity that binds a later descriptor to this exact node. A
 * missing path observes `undefined` rather than a node.
 */
export interface IdentityNodeObservation {
  readonly kind: IdentityFileKind;
  readonly device: number;
  readonly inode: number;
}

/** Low-level no-follow filesystem operations used only by the production adapter. */
export interface IdentityFileSystemPort<Handle> {
  lstat(pathValue: string): Result<IdentityNodeObservation | undefined, Error>;
  realpath(pathValue: string): Result<string, Error>;
  openReadNoFollow(pathValue: string): Result<Handle, Error>;
  fstat(handle: Handle): Result<IdentityNodeObservation, Error>;
  read(handle: Handle): Result<Uint8Array, Error>;
  close(handle: Handle): Result<void, Error>;
}

/** Lexical containment asserted for one implementation-identity member. */
export interface ContainedIdentityRead {
  readonly chainRoot: string;
  readonly ownerRoot: string;
  readonly path: string;
}

/** One immutable lstat observation in the chain from root to leaf. */
export interface IdentityPathComponentObservation {
  readonly path: string;
  readonly kind: IdentityFileKind | undefined;
  readonly device?: number;
  readonly inode?: number;
}

/** Complete immutable path observation checked before open or before accept. */
export interface IdentityPathObservation {
  readonly components: readonly IdentityPathComponentObservation[];
  readonly canonicalPath: string;
}

/**
 * Phase-specific secure operations consumed by identity-read orchestration.
 *
 * `validateBeforeOpen` returns the validated LEAF node identity; the
 * orchestrator threads it into `readRegularDescriptor`, which must refuse a
 * descriptor whose fstat identity differs — the binding that closes the
 * ancestor-swap-during-open window (an `O_NOFOLLOW` open still follows
 * symlinked ancestors, so path validation alone cannot see the swap).
 */
export interface IdentitySecureFilePort<Handle> {
  canonicalRealpath(pathValue: string): Result<string, Error>;
  validateBeforeOpen(input: ContainedIdentityRead): Result<IdentityNodeObservation, Error>;
  openNoFollow(pathValue: string): Result<Handle, Error>;
  readRegularDescriptor(
    input: ContainedIdentityRead,
    handle: Handle,
    expected: IdentityNodeObservation,
  ): Result<Uint8Array, Error>;
  validateBeforeAccept(
    input: ContainedIdentityRead,
    expected: IdentityNodeObservation,
  ): Result<void, Error>;
  close(handle: Handle): Result<void, Error>;
}

/** Secure reads consumed by implementation-identity closure discovery. */
export interface IdentityReadPort {
  canonicalRealpath(pathValue: string): Result<string, Error>;
  readRegularFileNoFollow(input: ContainedIdentityRead): Result<Uint8Array, Error>;
}
