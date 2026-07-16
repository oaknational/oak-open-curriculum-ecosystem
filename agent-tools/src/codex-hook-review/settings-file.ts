import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { isJsonObject, type JsonObject } from '../core/json.js';
import {
  ensureGuardedDirectory,
  inspectGuardedDirectory,
  readGuardedRegularFile,
  writeGuardedAtomic,
} from './guarded-local-io.js';

export const CLAUDE_LOCAL_SETTINGS = '.claude/settings.local.json';
const MAX_LOCAL_SETTINGS_BYTES = 1024 * 1024;

export interface LocalSettingsError {
  readonly kind: 'invalid' | 'read-failed' | 'write-failed';
}

export async function readClaudeLocalSettings(
  projectRoot: string,
): Promise<Result<JsonObject, LocalSettingsError>> {
  const directory = await inspectGuardedDirectory(projectRoot, ['.claude']);
  if (!directory.ok) {
    return directory.error.kind === 'directory-missing' ? ok({}) : err({ kind: 'invalid' });
  }
  const settings = await readGuardedRegularFile(
    join(projectRoot, CLAUDE_LOCAL_SETTINGS),
    MAX_LOCAL_SETTINGS_BYTES,
  );
  if (!settings.ok) {
    return settings.error.kind === 'file-missing' ? ok({}) : err({ kind: 'read-failed' });
  }
  try {
    const parsed: unknown = JSON.parse(settings.value.content.toString('utf8'));
    return isJsonObject(parsed) ? ok(parsed) : err({ kind: 'invalid' });
  } catch {
    return err({ kind: 'invalid' });
  }
}

export async function writeClaudeLocalSettings(
  projectRoot: string,
  settings: JsonObject,
): Promise<Result<void, LocalSettingsError>> {
  const path = join(projectRoot, CLAUDE_LOCAL_SETTINGS);
  const directory = await ensureGuardedDirectory(projectRoot, [{ name: '.claude' }]);
  if (!directory.ok) {
    return err({ kind: 'write-failed' });
  }
  const written = await writeGuardedAtomic(
    path,
    `${JSON.stringify(settings, null, 2)}\n`,
    0o600,
    randomUUID(),
  );
  return written.ok ? ok(undefined) : err({ kind: 'write-failed' });
}
