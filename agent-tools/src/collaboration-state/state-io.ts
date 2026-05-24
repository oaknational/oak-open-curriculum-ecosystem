import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { createCommsEvent } from './comms.js';
import {
  parseClosedClaimsArchive,
  parseCollaborationRegistry,
  parseCommsEvent,
} from './state-parsers.js';
import {
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

  await writeFile(eventPath(input.commsDir, event.event_id), eventJson(event), { flag: 'wx' });
}

/**
 * Read all canonical immutable communication events from the unified comms
 * directory.
 */
export async function readCommsEvents(commsDir: string): Promise<readonly CommsEvent[]> {
  return readEventDirectory(commsDir, parseCommsEvent);
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

function eventJson(event: CommsEvent): string {
  return `${JSON.stringify(event, null, 2)}\n`;
}

function filterEvents<TKind extends CommsEvent['kind']>(
  events: readonly CommsEvent[],
  kind: TKind,
): readonly Extract<CommsEvent, { readonly kind: TKind }>[] {
  return events.filter((event): event is Extract<CommsEvent, { readonly kind: TKind }> => {
    return event.kind === kind;
  });
}
