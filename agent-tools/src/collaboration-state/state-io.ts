import { mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { unwrapOrThrow, type Result } from '@oaknational/result';

import { createCommsEvent } from './comms.js';
import { validateCollaborationJsonFileText } from './collaboration-json-validation.js';
import {
  readActiveClaimsFile,
  readClosedClaimsFile,
  type ReadTextFile,
} from './state-file-readers.js';
import {
  activeClaimsWriteValidator,
  closedClaimsWriteValidator,
  commsEventWriteValidator,
} from './state-io-write-validators.js';
import { parseCollaborationRegistry, parseCommsEvent } from './state-parsers.js';
import {
  createJsonFileAtomically,
  runJsonStateTransaction,
  updateJsonFileWithRetry,
  writeJsonFileWithinTransaction,
} from './transaction.js';
import {
  type ClosedClaimsArchive,
  type CollaborationRegistry,
  type CommsEvent,
  type DirectedCommsMessage,
} from './types.js';

export {
  readActiveClaimsFile,
  readClosedClaimsFile,
  type ReadTextFile,
} from './state-file-readers.js';

/**
 * Append an immutable communication event to the canonical comms directory by
 * exclusive file create.
 */
export async function writeCommsEvent(input: {
  readonly commsDir: string;
  readonly event: CommsEvent;
  readonly nowIso: string;
}): Promise<void> {
  await mkdir(input.commsDir, { recursive: true });
  const existingIds = await listCommsEventIds(input.commsDir);
  const event = createCommsEvent(input.event, {
    nowIso: input.nowIso,
    existingEventIds: existingIds,
  });

  const path = eventPath(input.commsDir, event.event_id);
  await createJsonFileAtomically({
    filePath: path,
    value: event,
    validateText: commsEventWriteValidator(path),
  });
}

/**
 * Read all canonical immutable communication events from the unified comms
 * directory. Cost is linear in the directory's TOTAL size — repeated drains
 * should use {@link readCommsEventsExcluding} instead.
 */
export async function readCommsEvents(commsDir: string): Promise<readonly CommsEvent[]> {
  return readEventDirectory(commsDir, parseCommsEvent);
}

/**
 * Read only the comms events whose ids are absent from `excludeIds` — the
 * incremental drain (MCP-198).
 *
 * The watch loop re-drains on every pass. Reading the whole directory made
 * that cost proportional to TOTAL event count rather than to how many events
 * were new — cheap at idle, but it multiplies under host contention and
 * crossed the watcher's per-step deadline during ordinary repository builds.
 *
 * Filenames are `<event_id>.json` (see `eventPath`), so the id is known from
 * the directory listing alone and no unwanted file is ever opened.
 */
export async function readCommsEventsExcluding(
  commsDir: string,
  excludeIds: ReadonlySet<string>,
): Promise<readonly CommsEvent[]> {
  const wanted = (await listCommsEventIds(commsDir))
    .filter((id) => !excludeIds.has(id))
    .map((id) => `${id}.json`);
  return readEventFiles(commsDir, wanted, parseCommsEvent);
}

/**
 * Read all immutable directed communication messages from the canonical comms
 * directory.
 */
export async function readDirectedCommsMessages(
  commsDir: string,
): Promise<readonly DirectedCommsMessage[]> {
  return filterEvents(await readCommsEvents(commsDir), 'directed');
}

/**
 * Transactionally update the active claims registry.
 *
 * The pre-transaction read surfaces the fresh-checkout seeding error (see
 * {@link readActiveClaimsFile}) before the retry transaction's generic read
 * meets a bare ENOENT; the transaction still re-reads under its lock. The
 * optional `readTextFile` seam (ADR-078) exists so that surfacing is
 * provable without real IO.
 */
export async function updateActiveClaimsFile(input: {
  readonly activePath: string;
  readonly transform: (registry: CollaborationRegistry) => CollaborationRegistry;
  readonly readTextFile?: ReadTextFile;
}): Promise<void> {
  unwrapOrThrow(await readActiveClaimsFile(input.activePath, input.readTextFile));
  await updateJsonFileWithRetry({
    filePath: input.activePath,
    parseText: parseCollaborationRegistry,
    validateText: activeClaimsWriteValidator(input.activePath),
    transform: input.transform,
    maxAttempts: 5,
  });
}

/**
 * Transactionally update the active and closed claim state together.
 *
 * As with {@link updateActiveClaimsFile}, the pre-transaction reads surface
 * the fresh-checkout seeding errors before any lock is taken, and the
 * optional `readTextFile` seam (ADR-078) makes that surfacing provable
 * without real IO; the transaction still re-reads under its lock.
 */
export async function updateClaimStateFiles(input: {
  readonly activePath: string;
  readonly closedPath: string;
  readonly transform: (state: {
    readonly active: CollaborationRegistry;
    readonly closed: ClosedClaimsArchive;
  }) => {
    readonly active: CollaborationRegistry;
    readonly closed: ClosedClaimsArchive;
  };
  readonly readTextFile?: ReadTextFile;
}): Promise<void> {
  unwrapOrThrow(await readActiveClaimsFile(input.activePath, input.readTextFile));
  unwrapOrThrow(await readClosedClaimsFile(input.closedPath, input.readTextFile));
  await runJsonStateTransaction({
    filePaths: [input.activePath, input.closedPath],
    operation: async () => {
      const active = unwrapOrThrow(await readActiveClaimsFile(input.activePath));
      const closed = unwrapOrThrow(await readClosedClaimsFile(input.closedPath));
      const next = input.transform({ active, closed });

      await writeJsonFileWithinTransaction({
        filePath: input.activePath,
        value: next.active,
        validateText: activeClaimsWriteValidator(input.activePath),
      });
      await writeJsonFileWithinTransaction({
        filePath: input.closedPath,
        value: next.closed,
        validateText: closedClaimsWriteValidator(input.closedPath),
      });
    },
  });
}

async function readEventDirectory<TEvent>(
  directory: string,
  parser: (text: string) => Result<TEvent, Error>,
): Promise<readonly TEvent[]> {
  const filenames: readonly string[] = await readdir(directory);
  return readEventFiles(
    directory,
    filenames.filter((entry) => entry.endsWith('.json')),
    parser,
  );
}

/**
 * Read and parse a NAMED set of event files, in stable filename order. Shared
 * by the full read and the incremental drain so both carry identical parse,
 * validation and failure semantics — the incremental path narrows WHICH files
 * are read, never HOW.
 */
async function readEventFiles<TEvent>(
  directory: string,
  filenames: readonly string[],
  parser: (text: string) => Result<TEvent, Error>,
): Promise<readonly TEvent[]> {
  const events: TEvent[] = [];

  for (const filename of filenames.toSorted((left, right) => left.localeCompare(right))) {
    const path = join(directory, filename);
    try {
      const text = await readFile(path, 'utf8');
      // Inside the loud wrap by intent: both unwraps (the parser's, then
      // schema validation's) rethrow their Err's ORIGINAL error, and the
      // catch labels it with the file path.
      const event = unwrapOrThrow(parser(text));
      unwrapOrThrow(await validateCollaborationJsonFileText(path, text));
      events.push(event);
    } catch (error) {
      throw new Error(
        `failed to parse collaboration JSON file ${path}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      );
    }
  }

  return events;
}

function listCommsEventIds(eventsDir: string): Promise<readonly string[]> {
  return readdir(eventsDir)
    .then((entries) =>
      entries
        .filter((entry) => entry.endsWith('.json'))
        .map((entry) => entry.slice(0, -'.json'.length)),
    )
    .catch(() => []);
}

function eventPath(eventsDir: string, eventId: string): string {
  return join(eventsDir, `${eventId}.json`);
}

function filterEvents<TKind extends CommsEvent['kind']>(
  events: readonly CommsEvent[],
  kind: TKind,
): readonly Extract<CommsEvent, { readonly kind: TKind }>[] {
  return events.filter((event): event is Extract<CommsEvent, { readonly kind: TKind }> => {
    return event.kind === kind;
  });
}
