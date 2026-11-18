/**
 * The file-system port of the owner-only append, and its one real binding.
 *
 * @remarks
 * `appendOwnerOnly` (`owner-only-append.ts`) reaches the file system only
 * through {@link OwnerOnlyAppendFs}, so its behaviour is proven against an
 * in-memory fake (ADR-078). The port returns Results;
 * {@link nodeOwnerOnlyAppendFs} is the single edge where `node:fs` throws
 * become them (ADR-088), keeping each failure's code and dropping its
 * message, which names the path. The port also supplies the open flags, so
 * the append never reads `node:fs` constants and a fake can model its own.
 *
 * @packageDocumentation
 */

import {
  closeSync,
  constants,
  fchmodSync,
  fstatSync,
  lstatSync,
  mkdirSync,
  openSync,
  writeSync,
} from 'node:fs';

import { err, ok, type Result } from '@oaknational/result';

import { errorCodeOf } from './error-code.js';
import { failureAsError } from './failure-as-error.js';

/** A file-system call's failure: its error code, and nothing else. */
export interface FsFailure {
  readonly code: string;
}

/**
 * What `fstat` reports of an open descriptor: its kind, owner, link count,
 * and identity (device and inode, exact as bigints).
 */
export interface DescriptorFacts {
  readonly isFile: boolean;
  readonly uid: number;
  readonly nlink: number;
  readonly dev: bigint;
  readonly ino: bigint;
}

/**
 * What `lstat` reports of a path's own entry, not following a symlink: whether
 * it is a regular file (a symlink is not), and its identity.
 */
export interface PathEntryFacts {
  readonly isFile: boolean;
  readonly dev: bigint;
  readonly ino: bigint;
}

/**
 * The open flags the platform provides. `noFollow` and `nonBlock` are
 * `undefined` where the platform has no such flag (Windows has neither).
 */
export interface OwnerOnlyOpenFlags {
  readonly writeOnly: number;
  readonly append: number;
  readonly create: number;
  readonly noFollow: number | undefined;
  readonly nonBlock: number | undefined;
}

/**
 * The file-system surface `appendOwnerOnly` needs, injectable for tests
 * (ADR-078). Every call returns a Result rather than throwing; the one real
 * binding, {@link nodeOwnerOnlyAppendFs}, translates `node:fs` throws at that
 * single edge. Stats are reduced to the questions asked of them, so fakes
 * need no `Stats` construction.
 */
export interface OwnerOnlyAppendFs {
  /**
   * The invoking user's uid, against which the append checks the file's
   * owner; `undefined` on a platform without POSIX ownership, where the
   * append refuses before touching anything.
   */
  readonly uid: number | undefined;
  /** The open flags this file system honours. */
  readonly openFlags: OwnerOnlyOpenFlags;
  /** Create the directory and any missing parents at the given mode. */
  mkdir(path: string, mode: number): Result<void, FsFailure>;
  open(path: string, flags: number, mode: number): Result<number, FsFailure>;
  fstat(fd: number): Result<DescriptorFacts, FsFailure>;
  /** Stat the path's own entry, not following a symlink. */
  lstat(path: string): Result<PathEntryFacts, FsFailure>;
  fchmod(fd: number, mode: number): Result<void, FsFailure>;
  /** Write from `data[offset]` for `length` bytes; returns the bytes consumed. */
  write(fd: number, data: Buffer, offset: number, length: number): Result<number, FsFailure>;
  close(fd: number): Result<void, FsFailure>;
}

/**
 * Translate a thrown `node:fs` failure to its code alone.
 *
 * @remarks
 * A `node:fs` error's message names the path it failed on, so only the code
 * crosses, as {@link errorCodeOf} (`error-code.ts`) shapes it; a code of any
 * other shape is withheld as `UNKNOWN`, as is a missing one. A non-Error
 * throwable is a defect and crashes (see {@link failureAsError}).
 *
 * @param failure - The value a `node:fs` call threw.
 * @returns The failure's code, or `UNKNOWN`.
 */
export function fsFailureOf(failure: unknown): FsFailure {
  const error = failureAsError(failure, 'the owner-only append fs boundary');
  return { code: errorCodeOf(error) ?? 'UNKNOWN' };
}

/**
 * Run one throwing call at the port's edge, returning its value as `ok` and
 * any throw as `err` through {@link fsFailureOf}.
 *
 * @remarks
 * Every member of {@link nodeOwnerOnlyAppendFs} runs through this, so no
 * `node:fs` throw crosses the port: a caller that discards the Result can
 * never be broken by the file system.
 *
 * @param call - The call to run.
 * @returns The call's value, or the failure's code alone.
 */
export function attempt<T>(call: () => T): Result<T, FsFailure> {
  try {
    return ok(call());
  } catch (error) {
    return err(fsFailureOf(error));
  }
}

/**
 * `node:fs` declares every flag on every platform, but on Windows
 * `O_NOFOLLOW` and `O_NONBLOCK` are absent at runtime. This models that truth
 * in the type, as `skills-adapter-generate/read-regular-file.ts` does.
 */
const hostOptionalFlags: Partial<Record<'O_NOFOLLOW' | 'O_NONBLOCK', number>> = {
  O_NOFOLLOW: constants.O_NOFOLLOW,
  O_NONBLOCK: constants.O_NONBLOCK,
};

/**
 * The real binding: synchronous `node:fs` calls, each throw translated by
 * {@link fsFailureOf}; the host's open flags; and the process's uid, read
 * when it is asked for, never at import. Stats are read as bigints so that
 * device and inode compare exactly on every platform.
 */
export const nodeOwnerOnlyAppendFs: OwnerOnlyAppendFs = {
  get uid() {
    return process.getuid?.();
  },
  openFlags: {
    writeOnly: constants.O_WRONLY,
    append: constants.O_APPEND,
    create: constants.O_CREAT,
    noFollow: hostOptionalFlags.O_NOFOLLOW,
    nonBlock: hostOptionalFlags.O_NONBLOCK,
  },
  mkdir: (path, mode) =>
    attempt(() => {
      mkdirSync(path, { recursive: true, mode });
    }),
  open: (path, flags, mode) => attempt(() => openSync(path, flags, mode)),
  fstat: (fd) =>
    attempt(() => {
      const stats = fstatSync(fd, { bigint: true });
      const { dev, ino } = stats;
      return {
        isFile: stats.isFile(),
        uid: Number(stats.uid),
        nlink: Number(stats.nlink),
        dev,
        ino,
      };
    }),
  lstat: (path) =>
    attempt(() => {
      const stats = lstatSync(path, { bigint: true });
      return { isFile: stats.isFile(), dev: stats.dev, ino: stats.ino };
    }),
  fchmod: (fd, mode) =>
    attempt(() => {
      fchmodSync(fd, mode);
    }),
  write: (fd, data, offset, length) => attempt(() => writeSync(fd, data, offset, length)),
  close: (fd) =>
    attempt(() => {
      closeSync(fd);
    }),
};
