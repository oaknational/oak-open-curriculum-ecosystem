/**
 * The state and path model of the in-memory file system behind the owner-only
 * append's port, for tests.
 *
 * @remarks
 * Paths are absolute POSIX strings on every platform, handled with
 * `node:path`'s `posix` functions, never the platform's own, so the fake keys
 * its entries identically on Windows. The root directory always exists. A
 * directory path is walked one component at a time from the root, as the
 * POSIX kernel does:
 *
 * - a directory is entered;
 * - a symlink is followed one hop to its target, which must be a directory
 *   (a dangling link is ENOENT, a link to anything else ENOTDIR);
 * - any other entry is ENOTDIR;
 * - an absent component is ENOENT, unless the walk creates it (a recursive
 *   mkdir).
 *
 * The open modelling lives in `in-memory-fs-open.ts`; the public constructor
 * in `in-memory-owner-only-append-fs.ts`. It performs no IO.
 *
 * @packageDocumentation
 */

import { posix } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import type { FsFailure, OwnerOnlyOpenFlags } from '../owner-only-append-fs.js';

/** The uid the fake file system runs as. */
export const FAKE_OWNER_UID = 501;

/** One entry in the fake file system. */
export type FakeEntry =
  | { readonly kind: 'directory'; mode: number; readonly uid: number }
  | { readonly kind: 'file'; mode: number; readonly uid: number; bytes: Buffer }
  | {
      readonly kind: 'fifo';
      mode: number;
      readonly uid: number;
      readonly hasReader: boolean;
      bytes: Buffer;
    }
  | { readonly kind: 'symlink'; readonly target: string };

/** An open descriptor: the entry path it resolved to, and how it writes. */
interface Descriptor {
  readonly path: string;
  readonly append: boolean;
  offset: number;
}

/** The fake's mutable state. */
export interface FakeState {
  readonly entries: Map<string, FakeEntry>;
  readonly descriptors: Map<number, Descriptor>;
  /** Each entry's inode number, assigned on first ask; a hard link shares one. */
  readonly inodes: WeakMap<FakeEntry, bigint>;
  /** The open flags this fake honours; see `in-memory-fs-open.ts`. */
  readonly openFlags: OwnerOnlyOpenFlags;
  nextFd: number;
  nextInode: bigint;
}

/** The one device every fake entry lives on. */
export const FAKE_DEVICE = 1n;

/** The entry's inode number, stable for the fake's life and shared by hard links. */
export function inodeOf(state: FakeState, entry: FakeEntry): bigint {
  const known = state.inodes.get(entry);
  if (known !== undefined) {
    return known;
  }
  const assigned = state.nextInode;
  state.nextInode += 1n;
  state.inodes.set(entry, assigned);
  return assigned;
}

/**
 * Enter one component of a directory walk at `candidate`, creating it at
 * `createMode` if it is absent and a mode is given. `nonDirectoryCode` is the
 * code for a component that exists but is no directory: EEXIST at a
 * recursive mkdir's final component, ENOTDIR everywhere else.
 */
function enter(
  state: FakeState,
  candidate: string,
  createMode: number | undefined,
  nonDirectoryCode: 'EEXIST' | 'ENOTDIR',
): Result<string, FsFailure> {
  const entry = state.entries.get(candidate);
  if (entry === undefined) {
    if (createMode === undefined) {
      return err({ code: 'ENOENT' });
    }
    state.entries.set(candidate, { kind: 'directory', mode: createMode, uid: FAKE_OWNER_UID });
    return ok(candidate);
  }
  const resolvedPath = entry.kind === 'symlink' ? entry.target : candidate;
  const resolved = state.entries.get(resolvedPath);
  if (resolved === undefined) {
    return err({ code: 'ENOENT' });
  }
  return resolved.kind === 'directory' ? ok(resolvedPath) : err({ code: nonDirectoryCode });
}

/**
 * Walk an absolute directory path from the root and return where it really
 * is. With `createMode`, absent components are created (a recursive mkdir,
 * whose final component, if it exists as a non-directory, is EEXIST);
 * without it, an absent component is ENOENT.
 */
export function walkDirectory(
  state: FakeState,
  directory: string,
  createMode?: number,
): Result<string, FsFailure> {
  const components = directory.split('/').filter((component) => component.length > 0);
  let reached = '/';
  for (const [index, component] of components.entries()) {
    const isFinal = index === components.length - 1;
    const nonDirectoryCode = isFinal && createMode !== undefined ? 'EEXIST' : 'ENOTDIR';
    const entered = enter(state, posix.join(reached, component), createMode, nonDirectoryCode);
    if (!entered.ok) {
      return entered;
    }
    reached = entered.value;
  }
  return ok(reached);
}

/** The entry path a file path names once its directory is walked, without following the leaf. */
export function namedEntryPath(state: FakeState, filePath: string): Result<string, FsFailure> {
  const directory = walkDirectory(state, posix.dirname(filePath));
  return directory.ok ? ok(posix.join(directory.value, posix.basename(filePath))) : directory;
}
