import { readFile } from 'node:fs/promises';

import { getJsonValue, isJsonObject } from './json.js';
import { validateCollaborationJsonFileText } from './collaboration-json-validation.js';
import { optional, required, type Options } from './cli-options.js';
import {
  parseClosedClaimsArchive,
  parseCollaborationRegistry,
  readCommsEvents,
} from './state-io.js';
import { updateJsonFileWithRetry, writeJsonFileAtomically } from './transaction.js';

interface EntriesFile {
  readonly entries: readonly unknown[];
}

export async function appendJsonEntry(options: Options): Promise<string> {
  const filePath = required(options, 'file');
  await updateJsonFileWithRetry({
    filePath,
    parseText: parseEntriesFile,
    validateText: (text) => validateCollaborationJsonFileText(filePath, text),
    transform: (value) => ({
      ...value,
      entries: [...value.entries, JSON.parse(required(options, 'entry-json'))],
    }),
    maxAttempts: 5,
  });

  return '';
}

export async function writeJsonBody(options: Options): Promise<string> {
  const filePath = required(options, 'file');
  await writeJsonFileAtomically({
    filePath,
    value: JSON.parse(required(options, 'body-json')),
    validateText: (text) => validateCollaborationJsonFileText(filePath, text),
  });

  return '';
}

export async function checkState(options: Options): Promise<string> {
  if (optional(options, 'active') !== undefined) {
    parseCollaborationRegistry(await readFile(required(options, 'active'), 'utf8'));
  }
  if (optional(options, 'closed') !== undefined) {
    parseClosedClaimsArchive(await readFile(required(options, 'closed'), 'utf8'));
  }
  if (optional(options, 'comms-dir') !== undefined) {
    await readCommsEvents(required(options, 'comms-dir'));
  }

  return 'ok\n';
}

function parseEntriesFile(text: string): EntriesFile {
  const parsed: unknown = JSON.parse(text);
  if (!isJsonObject(parsed)) {
    throw new Error('conversation file must contain entries array');
  }
  const entries = getJsonValue(parsed, 'entries');
  if (Array.isArray(entries)) {
    return {
      ...parsed,
      entries,
    };
  }

  throw new Error('conversation file must contain entries array');
}
