/**
 * The disk reads the repository walk makes ({@link RepositoryProbe}), and
 * their live implementation.
 *
 * @remarks
 * The walk itself (`repository-identity.ts`) is pure over this seam, so it is
 * tested over literal layouts; the live reads here are proven by running the
 * built hook against real checkouts. Every read answers without throwing, and
 * every failure reads as an unknown the walk keeps the block for: a missing
 * path as absent, anything else (a link where a file belongs, a pipe, a file
 * larger than git ever writes there, a refused read) as unreadable or unknown.
 *
 * @packageDocumentation
 */

import {
  accessSync,
  closeSync,
  constants,
  fstatSync,
  lstatSync,
  openSync,
  readSync,
  realpathSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';

import { readAtMost } from '../core/bounded-read.js';
import { errorCodeOf } from '../core/error-code.js';
import {
  entryIsDescriptorFile,
  HOST_ENFORCES_NO_FOLLOW,
  NO_FOLLOW_READ_FLAGS,
} from '../core/no-follow-read.js';

/** What reading a file gave: its text, no such file, or a file that could not be read. */
type FileReading =
  | { readonly kind: 'text'; readonly text: string }
  | { readonly kind: 'absent' }
  | { readonly kind: 'unreadable' };

/** What `<directory>/.git` is: a git directory, a pointer file, nothing, or anything else. */
type GitEntry = 'directory' | 'file' | 'absent' | 'unknown';

/** The disk reads the walk makes, injectable so the walk is tested over literal layouts. */
export interface RepositoryProbe {
  /** What `<directory>/.git` is; `unknown` for any other kind of entry or a failed read. */
  readonly gitEntry: (directory: string) => GitEntry;
  /** A regular file's text, or why there is none. */
  readonly readText: (filePath: string) => FileReading;
  /** A path's real path (links followed, the disk's own letter case), or `null` when it does not exist. */
  readonly realPath: (filePath: string) => string | null;
  /** Whether anything is at the path itself, a link that leads nowhere included; `true` when unsure. */
  readonly entryExists: (filePath: string) => boolean;
  /** Whether a path is a regular file with more than one hard link; `true` when unsure. */
  readonly sharedFile: (filePath: string) => boolean;
  /** A directory's identity on disk (device and inode), or `null` when it is no directory. */
  readonly identity: (directory: string) => string | null;
  /** Whether a path is a directory git can enter: links followed, and searchable by this process. */
  readonly searchableDirectory: (directory: string) => boolean;
}

/** The largest `.git`, `commondir` or `HEAD` file read; each is one short line in git's own. */
const MAX_POINTER_BYTES = 64 * 1024;

/** Whether a failed file-system call failed because the path does not exist. */
function isMissing(error: unknown): boolean {
  const code = error instanceof Error ? errorCodeOf(error) : undefined;
  return code === 'ENOENT' || code === 'ENOTDIR';
}

/**
 * Read a small regular file through one descriptor, so the file checked is the file read
 * (`core/no-follow-read.ts`: no final-link following, and on a host without `O_NOFOLLOW` the
 * path's own entry must be the file the descriptor holds). Anything else (a directory, a pipe,
 * a link, a file larger than a git pointer or `HEAD` ever is) reads as unreadable. The read
 * takes at most the cap plus one byte from the descriptor, so a file another process grows
 * after it was opened is refused, never read to its end, and no read outlasts the hook's
 * timeout.
 */
function readRegularFile(filePath: string): FileReading {
  let descriptor: number;
  try {
    descriptor = openSync(filePath, NO_FOLLOW_READ_FLAGS);
  } catch (error) {
    return isMissing(error) ? { kind: 'absent' } : { kind: 'unreadable' };
  }
  try {
    const stats = fstatSync(descriptor, { bigint: true });
    const ours =
      stats.isFile() &&
      (HOST_ENFORCES_NO_FOLLOW ||
        entryIsDescriptorFile(lstatSync(filePath, { bigint: true, throwIfNoEntry: false }), stats));
    const bytes = ours
      ? readAtMost(
          (buffer, offset, length) => readSync(descriptor, buffer, offset, length, null),
          MAX_POINTER_BYTES,
        )
      : undefined;
    return bytes === undefined
      ? { kind: 'unreadable' }
      : { kind: 'text', text: Buffer.from(bytes).toString('utf8') };
  } catch {
    return { kind: 'unreadable' };
  } finally {
    closeSync(descriptor);
  }
}

/** The live disk reads: `lstat`, one-descriptor file reads, native `realpath` and `stat`. */
export const diskRepositoryProbe: RepositoryProbe = {
  gitEntry: (directory) => {
    try {
      const stats = lstatSync(join(directory, '.git'));
      if (stats.isDirectory()) {
        return 'directory';
      }
      return stats.isFile() ? 'file' : 'unknown';
    } catch (error) {
      return isMissing(error) ? 'absent' : 'unknown';
    }
  },
  readText: readRegularFile,
  realPath: (filePath) => {
    try {
      return realpathSync.native(filePath);
    } catch {
      return null;
    }
  },
  entryExists: (filePath) => {
    try {
      return lstatSync(filePath, { throwIfNoEntry: false }) !== undefined;
    } catch (error) {
      return !isMissing(error);
    }
  },
  sharedFile: (filePath) => {
    try {
      const stats = lstatSync(filePath);
      return stats.isFile() && stats.nlink > 1;
    } catch {
      return true;
    }
  },
  identity: (directory) => {
    try {
      const stats = statSync(directory, { bigint: true });
      return stats.isDirectory() ? `${String(stats.dev)}:${String(stats.ino)}` : null;
    } catch {
      return null;
    }
  },
  searchableDirectory: (directory) => {
    try {
      accessSync(directory, constants.X_OK);
      return statSync(directory).isDirectory();
    } catch {
      return false;
    }
  },
};
