/**
 * One fd-anchored, no-follow read of a regular file's text — the shared
 * instrument the clear pass and the permission census both classify stubs
 * through. A separate `lstat` + `readFile` leaves a check→use window a
 * concurrent racer can swap the target through (CodeQL `js/file-system-race`);
 * opening once and operating on the file descriptor resolves the path a single
 * time, so the window is gone.
 */
import { constants, type BigIntStats } from 'node:fs';
import { lstat, open } from 'node:fs/promises';

import type { FsRead } from './carriage-fs.js';

/** Whether an error carries a given POSIX errno code. */
function hasErrnoCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

/**
 * Node's fs constants type declares every flag on every platform, but on
 * Windows both `O_NOFOLLOW` and `O_NONBLOCK` are absent at runtime — OR-ing
 * an `undefined` in as 0 silently drops the flag. Model that runtime truth
 * in the type; `O_NOFOLLOW`'s absence gets the identity-verification arm
 * below, while `O_NONBLOCK`'s is benign (Windows has no fifos to block on).
 */
const hostFlags: Partial<Record<'O_NOFOLLOW' | 'O_NONBLOCK', number>> = {
  O_NOFOLLOW: constants.O_NOFOLLOW,
  O_NONBLOCK: constants.O_NONBLOCK,
};
const hostNoFollow = hostFlags.O_NOFOLLOW;

/** The open flags this host can actually enforce (absent flags drop to 0,
 * deliberately and visibly — see {@link hostFlags}). */
const openFlags = constants.O_RDONLY | (hostNoFollow ?? 0) | (hostFlags.O_NONBLOCK ?? 0);

/**
 * States in which nothing readable exists at the name: absent (ENOENT), a
 * symlinked final component rejected by `O_NOFOLLOW` (ELOOP), or a regular
 * file squatting a path component (POSIX reports ENOTDIR; Windows reports
 * that same state as ENOENT — nothing can exist below a file, so absence is
 * the one truthful cross-platform classification).
 */
function isAbsenceAtOpen(error: unknown): boolean {
  return (
    hasErrnoCode(error, 'ENOENT') || hasErrnoCode(error, 'ELOOP') || hasErrnoCode(error, 'ENOTDIR')
  );
}

/**
 * The Windows arm of the no-follow contract: with no `O_NOFOLLOW`, the open
 * above followed a symlinked leaf, so verify AFTER anchoring the descriptor
 * that the path's own entry is a regular file and is the very file the
 * descriptor holds (device + inode) — a linked leaf, or one swapped in after
 * the open, fails the identity check and is refused, never read through.
 */
async function pathEntryIsExactly(path: string, viaHandle: BigIntStats): Promise<boolean> {
  const entry = await lstat(path, { bigint: true }).catch((error: unknown) => {
    // The entry vanished between open and verification: the descriptor no
    // longer corresponds to a live path entry, so it is not our stub.
    if (hasErrnoCode(error, 'ENOENT')) {
      return undefined;
    }
    throw error;
  });
  return (
    entry !== undefined &&
    entry.isFile() &&
    entry.dev === viaHandle.dev &&
    entry.ino === viaHandle.ino
  );
}

/**
 * Read a regular file's UTF-8 text with the symlink-leaf check and the read
 * fused into ONE file descriptor.
 *
 * On hosts that provide `O_NOFOLLOW` it rejects a symlinked final component
 * atomically at open (a stub is never a link — emission writes regular files
 * only), and `O_NONBLOCK` keeps a fifo at the name from blocking the open;
 * hosts without the flag get the post-open identity verification instead
 * (see {@link pathEntryIsExactly}).
 *
 * `undefined` means no regular file of ours exists at the name (see
 * {@link isAbsenceAtOpen}, plus a directory or special file confirmed by
 * fstat, plus the Windows-arm refusals). Any other open or read error is a
 * typed `failure` the caller MUST surface: reading it as absence lets a
 * check certify a silent subset (the census false-green this closes) and
 * lets a clear skip an unclassifiable entry.
 */
export async function readRegularFileTextNoFollow(
  path: string,
): Promise<FsRead<string | undefined>> {
  let handle;
  try {
    handle = await open(path, openFlags);
  } catch (error: unknown) {
    if (isAbsenceAtOpen(error)) {
      return { kind: 'ok', value: undefined };
    }
    return { kind: 'failure', message: `cannot open ${path}: ${String(error)}` };
  }
  try {
    const viaHandle = await handle.stat({ bigint: true });
    const isOurRegularFile =
      viaHandle.isFile() &&
      (hostNoFollow !== undefined || (await pathEntryIsExactly(path, viaHandle)));
    if (!isOurRegularFile) {
      return { kind: 'ok', value: undefined };
    }
    return { kind: 'ok', value: await handle.readFile('utf8') };
  } catch (error: unknown) {
    return { kind: 'failure', message: `cannot read ${path}: ${String(error)}` };
  } finally {
    await handle.close();
  }
}
