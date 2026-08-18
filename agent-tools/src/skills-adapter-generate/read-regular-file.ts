/**
 * One fd-anchored, no-follow read of a regular file's text — the shared
 * instrument the clear pass and the permission census both classify stubs
 * through. A separate `lstat` + `readFile` leaves a check→use window a
 * concurrent racer can swap the target through (CodeQL `js/file-system-race`);
 * opening once and operating on the file descriptor resolves the path a single
 * time, so the window is gone.
 */
import { constants } from 'node:fs';
import { open } from 'node:fs/promises';

import type { FsRead } from './carriage-fs.js';

/** Whether an error carries a given POSIX errno code. */
function hasErrnoCode(error: unknown, code: string): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === code;
}

/**
 * Read a regular file's UTF-8 text with the symlink-leaf check and the read
 * fused into ONE file descriptor.
 *
 * `O_NOFOLLOW` rejects a symlinked final component atomically at open (a stub
 * is never a link — emission writes regular files only), and `O_NONBLOCK`
 * keeps a fifo at the name from blocking the open. `undefined` means the entry
 * is absent (ENOENT), a symlink (ELOOP), or fstat-confirmed not a regular file
 * (a directory or special file at the name) — none of these is our stub. A
 * non-ENOENT open or read error is a typed `failure` the caller MUST surface:
 * reading it as absence lets a check certify a silent subset (the census
 * false-green this closes) and lets a clear skip an unclassifiable entry.
 */
export async function readRegularFileTextNoFollow(
  path: string,
): Promise<FsRead<string | undefined>> {
  let handle;
  try {
    handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  } catch (error: unknown) {
    if (hasErrnoCode(error, 'ENOENT') || hasErrnoCode(error, 'ELOOP')) {
      return { kind: 'ok', value: undefined };
    }
    return { kind: 'failure', message: `cannot open ${path}: ${String(error)}` };
  }
  try {
    if (!(await handle.stat()).isFile()) {
      return { kind: 'ok', value: undefined };
    }
    return { kind: 'ok', value: await handle.readFile('utf8') };
  } catch (error: unknown) {
    return { kind: 'failure', message: `cannot read ${path}: ${String(error)}` };
  } finally {
    await handle.close();
  }
}
