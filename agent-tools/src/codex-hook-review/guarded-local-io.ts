import { constants, type Stats } from 'node:fs';
import { lstat, open, rename, rm } from 'node:fs/promises';
import { dirname, isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { type GuardedLocalIoError } from './guarded-local-directory.js';

export {
  ensureGuardedDirectory,
  inspectGuardedDirectory,
  type GuardedDirectorySegment,
  type GuardedLocalIoError,
} from './guarded-local-directory.js';

export interface GuardedFileSnapshot {
  readonly content: Buffer;
  readonly stats: Stats;
}

export type GuardedFileInspection =
  | { readonly kind: 'missing' }
  | { readonly kind: 'file'; readonly stats: Stats };

const READ_NO_FOLLOW = constants.O_RDONLY | constants.O_NOFOLLOW;
const APPEND_NO_FOLLOW =
  constants.O_WRONLY | constants.O_APPEND | constants.O_CREAT | constants.O_NOFOLLOW;
const CREATE_EXCLUSIVE_NO_FOLLOW =
  constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW;

/** Inspect a final regular file through an O_NOFOLLOW descriptor. */
export async function inspectGuardedRegularFile(
  path: string,
): Promise<Result<GuardedFileInspection, GuardedLocalIoError>> {
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    handle = await open(path, READ_NO_FOLLOW);
    const stats = await handle.stat();
    if (!stats.isFile()) {
      return err({ kind: 'file-invalid' });
    }
    return ok({ kind: 'file', stats });
  } catch (error: unknown) {
    return isMissing(error) ? ok({ kind: 'missing' }) : err({ kind: 'file-invalid' });
  } finally {
    await closeQuietly(handle);
  }
}

/** Read one bounded regular file without following a final symbolic link. */
export async function readGuardedRegularFile(
  path: string,
  maximumBytes: number,
): Promise<Result<GuardedFileSnapshot, GuardedLocalIoError>> {
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    handle = await open(path, READ_NO_FOLLOW);
    const stats = await handle.stat();
    if (!stats.isFile() || stats.size > maximumBytes) {
      return err({ kind: 'file-invalid' });
    }
    const content = await handle.readFile();
    return content.byteLength <= maximumBytes
      ? ok({ content, stats })
      : err({ kind: 'file-invalid' });
  } catch (error: unknown) {
    return err({ kind: isMissing(error) ? 'file-missing' : 'file-read-failed' });
  } finally {
    await closeQuietly(handle);
  }
}

/** Atomically replace a missing or regular leaf without following symbolic links. */
export async function writeGuardedAtomic(
  path: string,
  content: string | Buffer,
  mode: number,
  temporaryToken: string,
): Promise<Result<void, GuardedLocalIoError>> {
  const existing = await inspectLeaf(path);
  if (!existing.ok) {
    return existing;
  }
  const temporaryPath = `${path}.${temporaryToken}.tmp`;
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    handle = await open(temporaryPath, CREATE_EXCLUSIVE_NO_FOLLOW, mode);
    await handle.writeFile(content);
    await handle.chmod(mode);
    await handle.close();
    handle = undefined;
    await rename(temporaryPath, path);
    return ok(undefined);
  } catch {
    await closeQuietly(handle);
    await removeQuietly(temporaryPath);
    return err({ kind: 'file-write-failed' });
  }
}

/** Append to a regular private file without following a final symbolic link. */
export async function appendGuardedRegularFile(
  path: string,
  content: string,
  mode: number,
): Promise<Result<void, GuardedLocalIoError>> {
  let handle: Awaited<ReturnType<typeof open>> | undefined;
  try {
    handle = await open(path, APPEND_NO_FOLLOW, mode);
    const stats = await handle.stat();
    if (!stats.isFile()) {
      return err({ kind: 'file-invalid' });
    }
    await handle.chmod(mode);
    await handle.writeFile(content);
    return ok(undefined);
  } catch {
    return err({ kind: 'file-write-failed' });
  } finally {
    await closeQuietly(handle);
  }
}

/** Remove a missing or regular leaf, rejecting symbolic links and other file kinds. */
export async function removeGuardedRegularFile(
  path: string,
): Promise<Result<void, GuardedLocalIoError>> {
  const inspected = await inspectLeaf(path);
  if (!inspected.ok) {
    return inspected;
  }
  if (inspected.value === 'missing') {
    return ok(undefined);
  }
  try {
    await rm(path);
    return ok(undefined);
  } catch {
    return err({ kind: 'file-remove-failed' });
  }
}

/** Rotate one regular file over a missing or regular destination without following links. */
export async function rotateGuardedRegularFile(
  source: string,
  destination: string,
): Promise<Result<void, GuardedLocalIoError>> {
  const [sourceLeaf, destinationLeaf] = await Promise.all([
    inspectLeaf(source),
    inspectLeaf(destination),
  ]);
  if (!sourceLeaf.ok) {
    return sourceLeaf;
  }
  if (!destinationLeaf.ok) {
    return destinationLeaf;
  }
  if (sourceLeaf.value === 'missing') {
    return ok(undefined);
  }
  if (destinationLeaf.value === 'file') {
    const removed = await removeGuardedRegularFile(destination);
    if (!removed.ok) {
      return removed;
    }
  }
  try {
    await rename(source, destination);
    return ok(undefined);
  } catch (error: unknown) {
    return isMissing(error) ? ok(undefined) : err({ kind: 'file-rename-failed' });
  }
}

async function inspectLeaf(path: string): Promise<Result<'missing' | 'file', GuardedLocalIoError>> {
  if (!isAbsolute(path) || dirname(path) === path) {
    return err({ kind: 'invalid-path' });
  }
  try {
    const details = await lstat(path);
    return details.isFile() && !details.isSymbolicLink()
      ? ok('file')
      : err({ kind: 'file-invalid' });
  } catch (error: unknown) {
    return isMissing(error) ? ok('missing') : err({ kind: 'file-read-failed' });
  }
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

async function closeQuietly(handle: Awaited<ReturnType<typeof open>> | undefined): Promise<void> {
  if (handle === undefined) {
    return;
  }
  try {
    await handle.close();
  } catch {
    // The primary I/O result remains authoritative.
  }
}

async function removeQuietly(path: string): Promise<void> {
  try {
    await rm(path, { force: true });
  } catch {
    // The primary atomic-write failure remains authoritative.
  }
}
