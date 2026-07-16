import { chmod, lstat, mkdir } from 'node:fs/promises';
import { isAbsolute, join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

export interface GuardedDirectorySegment {
  readonly name: string;
  readonly mode?: number;
}

export interface GuardedLocalIoError {
  readonly kind:
    | 'invalid-path'
    | 'directory-missing'
    | 'directory-create-failed'
    | 'directory-invalid'
    | 'directory-permission-failed'
    | 'file-missing'
    | 'file-invalid'
    | 'file-read-failed'
    | 'file-write-failed'
    | 'file-remove-failed'
    | 'file-rename-failed';
}

/** Create and validate a fixed owned path one component at a time below a trusted anchor. */
export async function ensureGuardedDirectory(
  anchor: string,
  segments: readonly GuardedDirectorySegment[],
): Promise<Result<string, GuardedLocalIoError>> {
  if (!validPathInput(anchor, segments)) {
    return err({ kind: 'invalid-path' });
  }
  let current = anchor;
  for (const segment of segments) {
    current = join(current, segment.name);
    const ensured = await ensureDirectoryComponent(current, segment.mode);
    if (!ensured.ok) {
      return ensured;
    }
  }
  return ok(current);
}

/** Validate a fixed existing directory path one component at a time below a trusted anchor. */
export async function inspectGuardedDirectory(
  anchor: string,
  segmentNames: readonly string[],
): Promise<Result<string, GuardedLocalIoError>> {
  const segments = segmentNames.map((name) => ({ name }));
  if (!validPathInput(anchor, segments)) {
    return err({ kind: 'invalid-path' });
  }
  let current = anchor;
  for (const segment of segments) {
    current = join(current, segment.name);
    const inspected = await inspectDirectoryComponent(current);
    if (!inspected.ok) {
      return inspected;
    }
  }
  return ok(current);
}

async function ensureDirectoryComponent(
  path: string,
  requiredMode: number | undefined,
): Promise<Result<void, GuardedLocalIoError>> {
  const created = await createDirectoryComponent(path, requiredMode);
  if (!created.ok) {
    return created;
  }
  const inspected = await inspectDirectoryComponent(path);
  if (!inspected.ok || requiredMode === undefined) {
    return inspected;
  }
  return setDirectoryMode(path, requiredMode);
}

async function createDirectoryComponent(
  path: string,
  requiredMode: number | undefined,
): Promise<Result<void, GuardedLocalIoError>> {
  try {
    await mkdir(path, { mode: requiredMode ?? 0o700 });
    return ok(undefined);
  } catch (error: unknown) {
    return isAlreadyExists(error) ? ok(undefined) : err({ kind: 'directory-create-failed' });
  }
}

async function inspectDirectoryComponent(path: string): Promise<Result<void, GuardedLocalIoError>> {
  try {
    const details = await lstat(path);
    return details.isDirectory() && !details.isSymbolicLink()
      ? ok(undefined)
      : err({ kind: 'directory-invalid' });
  } catch (error: unknown) {
    return err({ kind: isMissing(error) ? 'directory-missing' : 'directory-invalid' });
  }
}

async function setDirectoryMode(
  path: string,
  requiredMode: number,
): Promise<Result<void, GuardedLocalIoError>> {
  try {
    await chmod(path, requiredMode);
    return ok(undefined);
  } catch {
    return err({ kind: 'directory-permission-failed' });
  }
}

function validPathInput(anchor: string, segments: readonly GuardedDirectorySegment[]): boolean {
  return isAbsolute(anchor) && segments.length > 0 && segments.every(isSafeSegment);
}

function isSafeSegment(segment: GuardedDirectorySegment): boolean {
  return (
    segment.name.length > 0 &&
    segment.name !== '.' &&
    segment.name !== '..' &&
    !segment.name.includes('/') &&
    !segment.name.includes('\\')
  );
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

function isAlreadyExists(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST';
}
