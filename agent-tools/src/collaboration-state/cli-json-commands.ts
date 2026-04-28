import { readFile } from 'node:fs/promises';

import { getJsonValue, isJsonObject } from './json.js';
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
  await updateJsonFileWithRetry({
    filePath: required(options, 'file'),
    parseText: parseEntriesFile,
    transform: (value) => ({
      ...value,
      entries: [...value.entries, JSON.parse(required(options, 'entry-json'))],
    }),
    maxAttempts: 5,
  });

  return '';
}

export async function writeJsonBody(options: Options): Promise<string> {
  await writeJsonFileAtomically({
    filePath: required(options, 'file'),
    value: JSON.parse(required(options, 'body-json')),
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
  if (optional(options, 'events-dir') !== undefined) {
    await readCommsEvents(required(options, 'events-dir'));
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
