import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createNarrativeCommsEvent } from './comms.js';
import {
  parseClosedClaimsArchive,
  parseCollaborationRegistry,
  parseDirectedCommsMessage,
  parseLifecycleCommsEvent,
  parseNarrativeCommsEvent,
} from './state-parsers.js';
import {
  runJsonStateTransaction,
  updateJsonFileWithRetry,
  writeJsonFileWithinTransaction,
} from './transaction.js';
import {
  type ClosedClaimsArchive,
  type CollaborationRegistry,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';

export { parseClosedClaimsArchive, parseCollaborationRegistry } from './state-parsers.js';

/**
 * Read and parse the active claims registry.
 */
export async function readActiveClaimsFile(activePath: string): Promise<CollaborationRegistry> {
  return parseCollaborationRegistry(await readFile(activePath, 'utf8'));
}

/**
 * Read and parse the closed claims archive.
 */
export async function readClosedClaimsFile(closedPath: string): Promise<ClosedClaimsArchive> {
  return parseClosedClaimsArchive(await readFile(closedPath, 'utf8'));
}

/**
 * Append an immutable narrative communication event to the narrative
 * directory by exclusive file create. Narrative events are the only kind
 * authored at runtime; lifecycle and directed events are produced by other
 * workflows and migrated historically, so this is the only writer.
 */
export async function writeNarrativeCommsEvent(input: {
  readonly eventsDir: string;
  readonly event: NarrativeCommsEvent;
  readonly nowIso: string;
}): Promise<void> {
  await mkdir(input.eventsDir, { recursive: true });
  const existingIds = await listCommsEventIds(input.eventsDir);
  const event = createNarrativeCommsEvent(input.event, {
    nowIso: input.nowIso,
    existingEventIds: existingIds,
  });

  await writeFile(eventPath(input.eventsDir, event.event_id), eventJson(event), { flag: 'wx' });
}

/**
 * Read all immutable narrative communication events from the narrative
 * directory. Each file is parsed against `$defs.narrative` via the
 * single-schema narrative parser.
 */
export async function readNarrativeCommsEvents(
  eventsDir: string,
): Promise<readonly NarrativeCommsEvent[]> {
  return readEventDirectory(eventsDir, parseNarrativeCommsEvent);
}

/**
 * Read all immutable lifecycle communication events from the lifecycle
 * directory. Each file is parsed against `$defs.lifecycle`.
 */
export async function readLifecycleCommsEvents(
  lifecycleDir: string,
): Promise<readonly LifecycleCommsEvent[]> {
  return readEventDirectory(lifecycleDir, parseLifecycleCommsEvent);
}

/**
 * Read all immutable directed communication messages from the directed
 * directory. Each file is parsed against `$defs.directed`.
 */
export async function readDirectedCommsMessages(
  messagesDir: string,
): Promise<readonly DirectedCommsMessage[]> {
  return readEventDirectory(messagesDir, parseDirectedCommsMessage);
}

/**
 * Transactionally update the active claims registry.
 */
export async function updateActiveClaimsFile(input: {
  readonly activePath: string;
  readonly transform: (registry: CollaborationRegistry) => CollaborationRegistry;
}): Promise<void> {
  await updateJsonFileWithRetry({
    filePath: input.activePath,
    parseText: parseCollaborationRegistry,
    transform: input.transform,
    maxAttempts: 5,
  });
}

/**
 * Transactionally update the active and closed claim state together.
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
}): Promise<void> {
  await runJsonStateTransaction({
    filePaths: [input.activePath, input.closedPath],
    operation: async () => {
      const active = parseCollaborationRegistry(await readFile(input.activePath, 'utf8'));
      const closed = parseClosedClaimsArchive(await readFile(input.closedPath, 'utf8'));
      const next = input.transform({ active, closed });

      await writeJsonFileWithinTransaction({ filePath: input.activePath, value: next.active });
      await writeJsonFileWithinTransaction({ filePath: input.closedPath, value: next.closed });
    },
  });
}

async function readEventDirectory<TEvent>(
  directory: string,
  parser: (text: string) => TEvent,
): Promise<readonly TEvent[]> {
  const filenames: readonly string[] = await readdir(directory).catch(() => []);
  const events: TEvent[] = [];

  for (const filename of filenames
    .filter((entry) => entry.endsWith('.json'))
    .toSorted((left, right) => left.localeCompare(right))) {
    events.push(parser(await readFile(join(directory, filename), 'utf8')));
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

function eventJson(event: NarrativeCommsEvent): string {
  return `${JSON.stringify(event, null, 2)}\n`;
}
