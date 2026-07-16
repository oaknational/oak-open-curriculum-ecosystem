import { constants } from 'node:fs';
import { access, lstat } from 'node:fs/promises';
import { isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { type ExecutablePin } from './activation.js';
import { type RuntimeIntegrityError } from './runtime-integrity-types.js';

export async function captureExecutablePin(
  path: string,
): Promise<Result<ExecutablePin, RuntimeIntegrityError>> {
  if (!isAbsolute(path)) {
    return err({ kind: 'executable-path-invalid', path });
  }
  let details: Awaited<ReturnType<typeof lstat>>;
  try {
    details = await lstat(path);
  } catch {
    return err({ kind: 'executable-read-failed', path });
  }
  if (!details.isFile() || details.isSymbolicLink()) {
    return err({ kind: 'executable-invalid', path });
  }
  try {
    await access(path, constants.X_OK);
  } catch {
    return err({ kind: 'executable-permission-failed', path });
  }
  return ok({ path, size: details.size, mtimeMs: Math.trunc(details.mtimeMs) });
}

export async function verifyExecutablePin(
  pin: ExecutablePin,
): Promise<Result<boolean, RuntimeIntegrityError>> {
  const current = await captureExecutablePin(pin.path);
  if (!current.ok) {
    return current;
  }
  return ok(current.value.size === pin.size && current.value.mtimeMs === pin.mtimeMs);
}
