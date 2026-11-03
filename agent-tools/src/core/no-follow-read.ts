/**
 * The no-follow open that the hook's pointer-file reads and the skills-adapter
 * reader share: the open flags this host enforces, and the check that stands in
 * for `O_NOFOLLOW` where the host has none; and the non-blocking open of the
 * hook's prior-content read, which follows links but does not wait on a pipe.
 *
 * @remarks
 * Node's fs constants type declares every flag on every platform, but on
 * Windows both `O_NOFOLLOW` and `O_NONBLOCK` are absent at runtime, and OR-ing
 * an `undefined` in as 0 silently drops the flag. Where `O_NOFOLLOW` is absent
 * the open follows a linked leaf, so a reader verifies after opening that the
 * path's own entry is a regular file and is the very file the descriptor holds
 * (device and inode): a linked leaf, or one swapped in after the open, fails
 * the check and is refused, never read through. `O_NONBLOCK`'s absence is
 * benign (Windows has no FIFOs to block on).
 *
 * @packageDocumentation
 */

import { constants, lstatSync, type BigIntStats } from 'node:fs';

/** The two flags a host may lack at runtime, typed as the runtime has them. */
const hostFlags: Partial<Record<'O_NOFOLLOW' | 'O_NONBLOCK', number>> = {
  O_NOFOLLOW: constants.O_NOFOLLOW,
  O_NONBLOCK: constants.O_NONBLOCK,
};

/** Whether this host refuses a symbolic-link final component at open. */
export const HOST_ENFORCES_NO_FOLLOW = hostFlags.O_NOFOLLOW !== undefined;

/** Read-only open flags, with no final-link following and no pipe blocking where the host has them. */
export const NO_FOLLOW_READ_FLAGS =
  constants.O_RDONLY | (hostFlags.O_NOFOLLOW ?? 0) | (hostFlags.O_NONBLOCK ?? 0);

/** Read-only open flags that follow links but do not wait on a pipe, where the host has `O_NONBLOCK`. */
export const NON_BLOCKING_READ_FLAGS = constants.O_RDONLY | (hostFlags.O_NONBLOCK ?? 0);

/** The three facts of a stat the identity check reads: the kind, the device and the inode. */
export type FileIdentity = Pick<BigIntStats, 'isFile' | 'dev' | 'ino'>;

/**
 * Whether a path's own entry, read with `lstat` after the open, is the very
 * regular file the descriptor holds. Only a host without `O_NOFOLLOW` needs it.
 *
 * @param entry - The path's `lstat`, or `undefined` when the entry is gone.
 * @param viaDescriptor - The descriptor's `fstat`.
 * @returns `true` only for a regular file on the same device and inode.
 */
export function entryIsDescriptorFile(
  entry: FileIdentity | undefined,
  viaDescriptor: FileIdentity,
): boolean {
  return (
    entry !== undefined &&
    entry.isFile() &&
    entry.dev === viaDescriptor.dev &&
    entry.ino === viaDescriptor.ino
  );
}

/**
 * The synchronous Windows arm: where the host has no `O_NOFOLLOW` the open
 * followed a linked leaf, so the path's own entry (`lstat`, absent read as
 * gone) must be the very file the descriptor holds; a host that enforces
 * `O_NOFOLLOW` already refused a link at the open, so the answer is `true`.
 *
 * @param path - The path that was opened.
 * @param viaDescriptor - The descriptor's `fstat`.
 * @returns Whether the descriptor may be read as the path's regular file.
 */
export function pathEntryIsDescriptorFileSync(path: string, viaDescriptor: FileIdentity): boolean {
  if (HOST_ENFORCES_NO_FOLLOW) {
    return true;
  }
  return entryIsDescriptorFile(
    lstatSync(path, { bigint: true, throwIfNoEntry: false }),
    viaDescriptor,
  );
}
