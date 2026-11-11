/**
 * An in-memory file system behind the owner-only append's port, for tests.
 *
 * @remarks
 * Tests read its resulting state (modes, bytes, descriptors left open), never
 * the calls it received. It models the POSIX contract the append relies on,
 * and nothing more, identically on every platform:
 *
 * - paths are absolute POSIX strings, walked as `in-memory-fs-state.ts`
 *   describes; every ancestor of a given entry exists as a directory (0o755);
 * - `mkdir` is recursive: it creates each absent directory on the way, leaves
 *   an existing directory (or a symlink to one) alone, and fails as Node does
 *   (ENOTDIR for a non-directory ancestor, EEXIST for a non-directory at the
 *   final component, ENOENT for a dangling symlink);
 * - `open` and its flags are modelled in `in-memory-fs-open.ts`;
 * - `fstat` reports the descriptor's kind, owner, link count and identity,
 *   and `lstat` a path's own entry, where a hard link is one entry object held
 *   at several paths and so shares one inode.
 *
 * Symlinks resolve one hop. It performs no IO.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { typeSafeEntries } from '@oaknational/type-helpers';

import type {
  DescriptorFacts,
  FsFailure,
  OwnerOnlyAppendFs,
  PathEntryFacts,
} from '../owner-only-append-fs.js';
import { fakeOpen, fakeOpenFlags } from './in-memory-fs-open.js';
import {
  FAKE_DEVICE,
  FAKE_OWNER_UID,
  inodeOf,
  namedEntryPath,
  walkDirectory,
  type FakeEntry,
  type FakeState,
} from './in-memory-fs-state.js';

/** How the fake platform differs from the default. */
export interface InMemoryFileSystemOptions {
  /** False models a platform without no-follow; true by default. */
  readonly hasNoFollow?: boolean;
}

/** The fake's port, and the state a test reads after acting through it. */
export interface InMemoryFileSystem {
  readonly fs: OwnerOnlyAppendFs;
  /** Every entry by absolute POSIX path. */
  readonly entries: ReadonlyMap<string, FakeEntry>;
  /** The descriptors opened and not yet closed, with the path each resolved to. */
  readonly openDescriptors: ReadonlyMap<number, { readonly path: string }>;
}

type ByteEntry = Extract<FakeEntry, { bytes: Buffer }>;
type ModeEntry = Exclude<FakeEntry, { kind: 'symlink' }>;

function modeBearing(entry: FakeEntry | undefined): ModeEntry | undefined {
  return entry === undefined || entry.kind === 'symlink' ? undefined : entry;
}

function byteBearing(entry: FakeEntry | undefined): ByteEntry | undefined {
  return entry?.kind === 'file' || entry?.kind === 'fifo' ? entry : undefined;
}

function describedEntry(state: FakeState, fd: number): FakeEntry | undefined {
  const descriptor = state.descriptors.get(fd);
  return descriptor === undefined ? undefined : state.entries.get(descriptor.path);
}

function fakeMkdir(state: FakeState, path: string, mode: number): Result<void, FsFailure> {
  const walked = walkDirectory(state, path, mode);
  return walked.ok ? ok(undefined) : walked;
}

/** A hard link is one entry at several paths, so the link count is the paths holding it. */
function linkCount(state: FakeState, entry: FakeEntry): number {
  return [...state.entries.values()].filter((candidate) => candidate === entry).length;
}

function fakeFstat(state: FakeState, fd: number): Result<DescriptorFacts, FsFailure> {
  const entry = modeBearing(describedEntry(state, fd));
  if (entry === undefined) {
    return err({ code: 'EBADF' });
  }
  const nlink = linkCount(state, entry);
  const ino = inodeOf(state, entry);
  return ok({ isFile: entry.kind === 'file', uid: entry.uid, nlink, dev: FAKE_DEVICE, ino });
}

function fakeLstat(state: FakeState, path: string): Result<PathEntryFacts, FsFailure> {
  const named = namedEntryPath(state, path);
  if (!named.ok) {
    return named;
  }
  const entry = state.entries.get(named.value);
  if (entry === undefined) {
    return err({ code: 'ENOENT' });
  }
  return ok({ isFile: entry.kind === 'file', dev: FAKE_DEVICE, ino: inodeOf(state, entry) });
}

function fakeFchmod(state: FakeState, fd: number, mode: number): Result<void, FsFailure> {
  const entry = modeBearing(describedEntry(state, fd));
  if (entry === undefined) {
    return err({ code: 'EBADF' });
  }
  entry.mode = mode;
  return ok(undefined);
}

function fakeWrite(state: FakeState, fd: number, chunk: Buffer): Result<number, FsFailure> {
  const descriptor = state.descriptors.get(fd);
  const entry = byteBearing(describedEntry(state, fd));
  if (descriptor === undefined || entry === undefined) {
    return err({ code: 'EBADF' });
  }
  const at = descriptor.append ? entry.bytes.length : descriptor.offset;
  entry.bytes = Buffer.concat([
    entry.bytes.subarray(0, at),
    chunk,
    entry.bytes.subarray(at + chunk.length),
  ]);
  descriptor.offset = at + chunk.length;
  return ok(chunk.length);
}

function fakeClose(state: FakeState, fd: number): Result<void, FsFailure> {
  return state.descriptors.delete(fd) ? ok(undefined) : err({ code: 'EBADF' });
}

/** The proper ancestors of an absolute POSIX path, root excluded: `/a/b/c` gives `/a`, `/a/b`. */
function ancestorsOf(path: string): string[] {
  const components = path.split('/').filter((component) => component.length > 0);
  return components.slice(0, -1).map((_, index) => `/${components.slice(0, index + 1).join('/')}`);
}

/**
 * Copy each entry once, so an entry given at several paths stays one entry (a
 * hard link), and give every entry's absent ancestors a directory (0o755).
 */
function initialEntries(initial: Readonly<Record<string, FakeEntry>>): Map<string, FakeEntry> {
  const copies = new Map<FakeEntry, FakeEntry>();
  const entries = new Map<string, FakeEntry>();
  for (const [path, entry] of typeSafeEntries(initial)) {
    const copy = copies.get(entry) ?? { ...entry };
    copies.set(entry, copy);
    entries.set(path, copy);
  }
  for (const ancestor of [...entries.keys()].flatMap(ancestorsOf)) {
    if (!entries.has(ancestor)) {
      entries.set(ancestor, { kind: 'directory', mode: 0o755, uid: FAKE_OWNER_UID });
    }
  }
  return entries;
}

/**
 * Build a fake file system holding copies of the given entries, running as
 * {@link FAKE_OWNER_UID}.
 *
 * @param initial - Entries by absolute POSIX path; copied, so an expectation
 * built from the same literal never moves with the fake's state. One entry
 * object given at two paths is one entry with two links.
 * @param options - How the fake platform differs from the default.
 * @returns The port and its readable state.
 */
export function inMemoryFileSystem(
  initial: Readonly<Record<string, FakeEntry>> = {},
  options: InMemoryFileSystemOptions = {},
): InMemoryFileSystem {
  const state: FakeState = {
    entries: initialEntries(initial),
    descriptors: new Map(),
    inodes: new WeakMap(),
    openFlags: fakeOpenFlags(options.hasNoFollow ?? true),
    nextFd: 10,
    nextInode: 100n,
  };
  const fs: OwnerOnlyAppendFs = {
    uid: FAKE_OWNER_UID,
    openFlags: state.openFlags,
    mkdir: (path, mode) => fakeMkdir(state, path, mode),
    open: (path, flags, mode) => fakeOpen(state, path, flags, mode),
    fstat: (fd) => fakeFstat(state, fd),
    lstat: (path) => fakeLstat(state, path),
    fchmod: (fd, mode) => fakeFchmod(state, fd, mode),
    write: (fd, data, offset, length) =>
      fakeWrite(state, fd, data.subarray(offset, offset + length)),
    close: (fd) => fakeClose(state, fd),
  };
  return { fs, entries: state.entries, openDescriptors: state.descriptors };
}
