import { mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { migrateLegacyCommsRecordCollections } from './comms-migration-records.js';
import { writeCommsEvent } from './state-io.js';
import { type CommsEvent } from './types.js';

interface LegacyCommsMigrationIo {
  readonly ensureDirectory: (directory: string) => Promise<void>;
  readonly readLegacyRecords: (directory: string) => Promise<readonly unknown[]>;
  readonly writeCommsEvent: (input: {
    readonly commsDir: string;
    readonly event: CommsEvent;
    readonly nowIso: string;
  }) => Promise<void>;
}

export async function migrateLegacyCommsDirectories(
  input: {
    readonly eventsDir: string;
    readonly lifecycleDir: string;
    readonly messagesDir: string;
    readonly commsDir: string;
  },
  io: LegacyCommsMigrationIo,
): Promise<number> {
  await io.ensureDirectory(input.commsDir);
  const events = migrateLegacyCommsRecordCollections({
    narratives: await io.readLegacyRecords(input.eventsDir),
    lifecycles: await io.readLegacyRecords(input.lifecycleDir),
    directed: await io.readLegacyRecords(input.messagesDir),
  });

  for (const event of events) {
    await io.writeCommsEvent({
      commsDir: input.commsDir,
      nowIso: event.created_at,
      event,
    });
  }

  return events.length;
}

export const filesystemLegacyCommsIo: LegacyCommsMigrationIo = {
  ensureDirectory: (directory) => mkdir(directory, { recursive: true }).then(() => undefined),
  readLegacyRecords,
  writeCommsEvent,
};

async function readLegacyRecords(directory: string): Promise<readonly unknown[]> {
  const filenames = await readdir(directory).catch(() => []);
  const records: unknown[] = [];

  for (const filename of filenames
    .filter((entry) => entry.endsWith('.json'))
    .toSorted((left, right) => left.localeCompare(right))) {
    records.push(JSON.parse(await readFile(join(directory, filename), 'utf8')));
  }

  return records;
}
