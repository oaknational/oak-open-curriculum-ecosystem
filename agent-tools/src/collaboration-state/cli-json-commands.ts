import { getJsonValue, isJsonObject } from './json.js';
import { validateCollaborationJsonFileText } from './collaboration-json-validation.js';
import { cliIo, type CliRuntime } from './cli-runtime.js';
import { optional, required, type Options } from './cli-options.js';
import { type CollaborationStateEnvironment } from './types.js';
import { updateJsonFileWithRetry, writeJsonFileAtomically } from './transaction.js';

interface EntriesFile {
  readonly entries: readonly unknown[];
}

export async function appendJsonEntry(options: Options): Promise<string> {
  const filePath = singleFileOption(options);
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

  return `appended entry to ${filePath}\n`;
}

export async function writeJsonBody(options: Options): Promise<string> {
  const filePath = singleFileOption(options);
  await writeJsonFileAtomically({
    filePath,
    value: JSON.parse(required(options, 'body-json')),
    validateText: (text) => validateCollaborationJsonFileText(filePath, text),
  });

  return `wrote ${filePath}\n`;
}

/**
 * Resolve the single `--file` target for conversation/escalation writes. The
 * argv parser collects every `--file` into the repeatable `files` array (the
 * shape `claims open` consumes), so value-map lookups never see it; these
 * single-target commands require exactly one.
 */
function singleFileOption(options: Options): string {
  const [filePath, ...extra] = options.files;
  if (filePath === undefined) {
    throw new Error('missing required option --file');
  }
  if (extra.length > 0) {
    throw new Error('expected exactly one --file');
  }

  return filePath;
}

export async function checkState(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  if (optional(options, 'active') !== undefined) {
    await io.readActiveClaimsFile(required(options, 'active'));
  }
  if (optional(options, 'closed') !== undefined) {
    await io.readClosedClaimsFile(required(options, 'closed'));
  }
  if (optional(options, 'comms-dir') !== undefined) {
    await io.readCommsEvents(required(options, 'comms-dir'));
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
