/**
 * The PreCompact observer's Node bindings: the stdin read and the two
 * transcript measurements, the only `node:fs` calls the observer makes
 * outside the owner-only append.
 *
 * @remarks
 * Each binding meets the contract `observePreCompact` (`observe.ts`) states
 * for it. The two measurements never throw: a path they cannot measure gives
 * `undefined`, and the observation records the measurement as absent. The
 * stdin read never throws for a failed read: it gives the unreadable variant
 * with the error's reason.
 *
 * Nothing here references `process.stdin`. Touching it makes Node set the
 * descriptor behind fd 0 non-blocking; when the harness hands the hook a
 * socket, the next `readSync` then gives `EAGAIN` instead of the payload. The
 * pre-execution probe observed this on macOS with Node 24. So stdin is read
 * with `readSync` on fd 0 alone.
 *
 * @packageDocumentation
 */

import { lstatSync, readdirSync, readSync, statSync, type Dirent } from 'node:fs';
import { join } from 'node:path';

import { failureAsError } from '../../core/failure-as-error.js';
import { EMPTY_CAPPED_READ, finishCappedRead, keepWithinCap, thrownReason } from './capped-read.js';
import type { StdinRead } from './payload.js';
import type { SiblingEntry } from './siblings.js';

/** The standard input descriptor. */
const STDIN_FD = 0;

/** How many bytes one stdin read asks for: 64 KiB, into one reused buffer. */
const READ_CHUNK_BYTES = 65_536;

/**
 * The size of the transcript file.
 *
 * @remarks
 * `statSync` follows a symlink at the path, so a linked transcript is
 * measured by its target. Every error is caught, `ERR_INVALID_ARG_VALUE` from
 * a NUL in the path included.
 *
 * @param path - The transcript's absolute path, as the payload gives it.
 * @returns The size in bytes when the path names a regular file; `undefined`
 *   when it names anything else (a directory has a size too) or cannot be
 *   measured.
 */
export function measureTranscriptBytes(path: string): number | undefined {
  try {
    const stats = statSync(path);
    return stats.isFile() ? stats.size : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Every entry in a directory: its name, its kind, and a file's size.
 *
 * @remarks
 * The kind comes from the directory entry itself and never follows a link.
 * Only a file is stat'd, with `lstatSync`, for its size. When that one call
 * fails, or finds the name no longer a regular file, the entry is kept
 * without a size. Every error from the listing itself is caught.
 *
 * @param directory - The transcript's directory.
 * @returns The entries in the order the directory gives them, or
 *   `undefined` when the directory cannot be listed.
 */
export function listDirectory(directory: string): readonly SiblingEntry[] | undefined {
  try {
    return readdirSync(directory, { withFileTypes: true }).map((entry) =>
      siblingEntry(directory, entry),
    );
  } catch {
    return undefined;
  }
}

/** One listed entry, with its size when it is a file whose size was read. */
function siblingEntry(directory: string, entry: Dirent): SiblingEntry {
  const kind = entryKind(entry);
  if (kind !== 'file') {
    return { name: entry.name, kind };
  }
  const size = regularFileSize(join(directory, entry.name));
  return size === undefined ? { name: entry.name, kind } : { name: entry.name, kind, size };
}

/** The entry's kind, read from the directory entry without following a link. */
function entryKind(entry: Dirent): SiblingEntry['kind'] {
  if (entry.isSymbolicLink()) {
    return 'symlink';
  }
  if (entry.isFile()) {
    return 'file';
  }
  return entry.isDirectory() ? 'directory' : 'other';
}

/** The size of the regular file at the path, not following a link; else `undefined`. */
function regularFileSize(path: string): number | undefined {
  try {
    const stats = lstatSync(path);
    return stats.isFile() ? stats.size : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Read stdin to its end, keeping at most the cap.
 *
 * @remarks
 * Reads fd 0 with `readSync` into one reused 64 KiB buffer and folds each
 * chunk through `keepWithinCap` (`capped-read.ts`), until a read returns 0
 * bytes. A read that throws, first or after some chunks, gives the unreadable
 * variant with the error's reason, and the bytes already read are lost as
 * evidence. `EAGAIN` is such an error: there is no retry and no sleep, so the
 * hook never waits on a stdin that is not ready.
 *
 * The caught value is narrowed through `failureAsError`
 * (`core/failure-as-error.ts`, owner ruling 2026-07-20). A thrown value that
 * is not an Error makes that narrowing throw a `TypeError`, which leaves this
 * function for the entry's catch.
 *
 * @returns The text kept, with any bytes dropped past the cap; or the
 *   unreadable variant with the read error's reason.
 */
export function readCappedStdin(): StdinRead {
  const buffer = Buffer.alloc(READ_CHUNK_BYTES);
  let read = EMPTY_CAPPED_READ;
  try {
    let bytesRead = readSync(STDIN_FD, buffer, 0, buffer.length, null);
    while (bytesRead > 0) {
      read = keepWithinCap(read, buffer.subarray(0, bytesRead));
      bytesRead = readSync(STDIN_FD, buffer, 0, buffer.length, null);
    }
  } catch (error) {
    return {
      kind: 'unreadable',
      reason: thrownReason(failureAsError(error, 'pre-compact-observe stdin')),
    };
  }
  return finishCappedRead(read);
}
