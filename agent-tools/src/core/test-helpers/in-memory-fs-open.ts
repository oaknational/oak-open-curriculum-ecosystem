/**
 * The open and flag modelling of the in-memory file system behind the
 * owner-only append's port, for tests.
 *
 * @remarks
 * The fake defines its own fixed flag values ({@link FAKE_OPEN_FLAGS}) and
 * supplies them through the port, so it behaves identically on every
 * platform and never reads `node:fs` constants. It can also model a platform
 * without no-follow, where the flag is absent and a symlink at the file name
 * is followed.
 *
 * `open` walks the file's directory (see `in-memory-fs-state.ts`), then:
 *
 * - an open without write-only, or with any flag the fake does not honour,
 *   is EINVAL, so a flag change the fake cannot model fails loudly;
 * - with no-follow, a symlink at the file name is ELOOP; without it, the
 *   link is followed one hop;
 * - an absent file is created with create, and is ENOENT without it;
 * - with nonblocking, a FIFO with no reader is ENXIO;
 * - a write through a descriptor opened without append lands at its offset.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';

import type { FsFailure, OwnerOnlyOpenFlags } from '../owner-only-append-fs.js';
import {
  FAKE_OWNER_UID,
  namedEntryPath,
  type FakeEntry,
  type FakeState,
} from './in-memory-fs-state.js';

/** The fake's own flag values: fixed, distinct bits, the same on every platform. */
const FAKE_OPEN_FLAGS: OwnerOnlyOpenFlags = {
  writeOnly: 0x01,
  append: 0x02,
  create: 0x04,
  noFollow: 0x08,
  nonBlock: 0x10,
};

/**
 * The flags a fake platform provides: {@link FAKE_OPEN_FLAGS}, less
 * no-follow on a platform without it.
 */
export function fakeOpenFlags(hasNoFollow: boolean): OwnerOnlyOpenFlags {
  return hasNoFollow ? FAKE_OPEN_FLAGS : { ...FAKE_OPEN_FLAGS, noFollow: undefined };
}

/** Whether every bit of `flag` is set; an absent flag is never set. */
function hasFlag(flags: number, flag: number | undefined): boolean {
  return flag !== undefined && (flags & flag) === flag;
}

/** EINVAL for an open the fake cannot honour: no write-only, or a flag it does not model. */
function refusalOfFlags(flags: number, honoured: OwnerOnlyOpenFlags): FsFailure | undefined {
  const modelled =
    honoured.writeOnly |
    honoured.append |
    honoured.create |
    (honoured.noFollow ?? 0) |
    (honoured.nonBlock ?? 0);
  const unmodelled = (flags & ~modelled) !== 0;
  return unmodelled || !hasFlag(flags, honoured.writeOnly) ? { code: 'EINVAL' } : undefined;
}

/** Why an open of the resolved entry refuses under these flags, if it does. */
function refusalAtOpen(
  entry: FakeEntry | undefined,
  flags: number,
  honoured: OwnerOnlyOpenFlags,
): FsFailure | undefined {
  if (entry === undefined) {
    return hasFlag(flags, honoured.create) ? undefined : { code: 'ENOENT' };
  }
  const readerless = entry.kind === 'fifo' && !entry.hasReader;
  return readerless && hasFlag(flags, honoured.nonBlock) ? { code: 'ENXIO' } : undefined;
}

/**
 * The entry path an open lands on: the named entry, or, for a symlink at the
 * name, ELOOP under no-follow and otherwise the link's target, one hop.
 */
function landingPath(state: FakeState, path: string, flags: number): Result<string, FsFailure> {
  const named = namedEntryPath(state, path);
  if (!named.ok) {
    return named;
  }
  const leaf = state.entries.get(named.value);
  if (leaf?.kind !== 'symlink') {
    return named;
  }
  return hasFlag(flags, state.openFlags.noFollow) ? err({ code: 'ELOOP' }) : ok(leaf.target);
}

/** Record a descriptor on the landing entry, creating an absent file there first. */
function newDescriptor(state: FakeState, landing: string, flags: number, mode: number): number {
  if (!state.entries.has(landing)) {
    const created: FakeEntry = { kind: 'file', mode, uid: FAKE_OWNER_UID, bytes: Buffer.alloc(0) };
    state.entries.set(landing, created);
  }
  const fd = state.nextFd;
  state.nextFd += 1;
  const append = hasFlag(flags, state.openFlags.append);
  state.descriptors.set(fd, { path: landing, append, offset: 0 });
  return fd;
}

/** Open a file in the fake, as its module remarks describe. */
export function fakeOpen(
  state: FakeState,
  path: string,
  flags: number,
  mode: number,
): Result<number, FsFailure> {
  const invalid = refusalOfFlags(flags, state.openFlags);
  if (invalid !== undefined) {
    return err(invalid);
  }
  const landing = landingPath(state, path, flags);
  if (!landing.ok) {
    return landing;
  }
  const refusal = refusalAtOpen(state.entries.get(landing.value), flags, state.openFlags);
  return refusal === undefined
    ? ok(newDescriptor(state, landing.value, flags, mode))
    : err(refusal);
}
