/**
 * The write-hook's prior-content read: a Write's prior content and an
 * `apply_patch` move's source, read so that no request holds the hook past its
 * timeout, which the host takes as an allow.
 *
 * @remarks
 * Each file is opened once without waiting on a pipe, and read only when the
 * descriptor holds a regular file (links followed, as the write follows them),
 * at most the size it reported. Every read in one request draws on one byte
 * budget, since the scan's time grows with the bytes read: a file larger than
 * what is left reads as none. None is deny-ward: a Write's new content is then
 * all new, and a move's source fails closed.
 *
 * @packageDocumentation
 */

import { closeSync, fstatSync, openSync, readSync } from 'node:fs';

import { readAtMost } from '../core/bounded-read.js';
import { NON_BLOCKING_READ_FLAGS } from '../core/no-follow-read.js';

/** The descriptor operations the read makes, injected so it is tested without the disk. */
export interface PriorReadEdge {
  /** Open a path for reading without waiting on a pipe; throws when it cannot. */
  readonly open: (filePath: string) => number;
  /** What the descriptor holds: whether a regular file, and its size in bytes. */
  readonly describe: (descriptor: number) => {
    readonly regularFile: boolean;
    readonly size: number;
  };
  /** Read into `buffer` from `offset`, at most `length` bytes; 0 at the end. */
  readonly read: (descriptor: number, buffer: Uint8Array, offset: number, length: number) => number;
  /** Close the descriptor. */
  readonly close: (descriptor: number) => void;
}

/**
 * The most bytes of content one request's reads return for scanning; each read also takes one
 * byte past its file's reported size, to tell a file that grew. A scan's time grows with the
 * lines it reads and the patterns in scope, and this many bytes of empty lines, the worst
 * shape, scan in well under a second, far inside the timeout.
 */
export const REQUEST_READ_BUDGET = 1024 * 1024;

/** The live disk edge. */
export const diskPriorReadEdge: PriorReadEdge = {
  open: (filePath) => openSync(filePath, NON_BLOCKING_READ_FLAGS),
  describe: (descriptor) => {
    const stats = fstatSync(descriptor);
    return { regularFile: stats.isFile(), size: stats.size };
  },
  read: (descriptor, buffer, offset, length) => readSync(descriptor, buffer, offset, length, null),
  close: closeSync,
};

/**
 * A prior-content reader for one request.
 *
 * @param edge - The descriptor operations.
 * @param budgetBytes - The most bytes of content all of this reader's reads may return together.
 * @returns A reader giving a file's text, or `null` for anything but a regular
 *   file within what is left of the budget.
 */
export function priorContentReader(
  edge: PriorReadEdge,
  budgetBytes: number,
): (filePath: string) => string | null {
  let left = budgetBytes;
  return (filePath) => {
    let descriptor: number;
    try {
      descriptor = edge.open(filePath);
    } catch {
      return null;
    }
    try {
      const { regularFile, size } = edge.describe(descriptor);
      const bytes =
        regularFile && size <= left
          ? readAtMost(
              (buffer, offset, length) => edge.read(descriptor, buffer, offset, length),
              size,
            )
          : undefined;
      if (bytes === undefined) {
        return null;
      }
      left -= bytes.length;
      return Buffer.from(bytes).toString('utf8');
    } catch {
      return null;
    } finally {
      edge.close(descriptor);
    }
  };
}
