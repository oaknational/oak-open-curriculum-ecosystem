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
import { type ClosedClaimsArchive, type CollaborationRegistry, type CommsEvent } from './types.js';

export { parseClosedClaimsArchive, parseCollaborationRegistry } from './state-parsers.js';

/**
 * Append an immutable communication event by exclusive file create.
 */
export async function writeCommsEvent(input: {
  readonly eventsDir: string;
  readonly event: CommsEvent;
  readonly nowIso: string;
}): Promise<void> {
  await mkdir(input.eventsDir, { recursive: true });
  const existingIds = await listCommsEventIds(input.eventsDir);
  const event = createCommsEvent(input.event, {
    nowIso: input.nowIso,
    existingEventIds: existingIds,
  });

  await writeFile(eventPath(input.eventsDir, event.event_id), eventJson(event), { flag: 'wx' });
}

/**
 * Read all immutable communication events from an event directory.
 */
export async function readCommsEvents(eventsDir: string): Promise<readonly CommsEvent[]> {
  const filenames = await readdir(eventsDir);
  const events: CommsEvent[] = [];

  for (const filename of filenames.filter((entry) => entry.endsWith('.json')).toSorted()) {
    events.push(parseCommsEvent(await readFile(join(eventsDir, filename), 'utf8')));
  }

  return events;
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
