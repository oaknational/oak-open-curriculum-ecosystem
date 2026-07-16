import { createHash, randomUUID } from 'node:crypto';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import {
  ensureGuardedDirectory,
  inspectGuardedDirectory,
  readGuardedRegularFile,
  writeGuardedAtomic,
} from './guarded-local-io.js';

const MAX_LOCAL_STATE_BYTES = 1024 * 1024;

export interface LocalStateIoError {
  readonly kind: 'missing' | 'invalid' | 'read-failed' | 'write-failed';
}

export interface LocalStatePath {
  readonly anchor: string;
  readonly directories: readonly string[];
  readonly basename: string;
}

export async function writePrivateAtomic(
  path: LocalStatePath,
  content: string,
): Promise<Result<void, LocalStateIoError>> {
  const directory = await ensureGuardedDirectory(
    path.anchor,
    path.directories.map((name) => ({ name })),
  );
  if (!directory.ok) {
    return err({ kind: 'write-failed' });
  }
  const written = await writeGuardedAtomic(
    join(directory.value, path.basename),
    content,
    0o600,
    randomUUID(),
  );
  return written.ok ? ok(undefined) : err({ kind: 'write-failed' });
}

export function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

export async function readBoundedLocalFile(
  path: LocalStatePath,
): Promise<Result<string, LocalStateIoError>> {
  const directory = await inspectGuardedDirectory(path.anchor, path.directories);
  if (!directory.ok) {
    return err({
      kind: directory.error.kind === 'directory-missing' ? 'missing' : 'invalid',
    });
  }
  const content = await readGuardedRegularFile(
    join(directory.value, path.basename),
    MAX_LOCAL_STATE_BYTES,
  );
  if (!content.ok) {
    if (content.error.kind === 'file-missing') {
      return err({ kind: 'missing' });
    }
    return err({
      kind: content.error.kind === 'file-invalid' ? 'invalid' : 'read-failed',
    });
  }
  return ok(content.value.content.toString('utf8'));
}
