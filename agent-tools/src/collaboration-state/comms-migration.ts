import { mkdir, readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { z } from 'zod';

import { writeCommsEvent } from './state-io.js';
import { type CollaborationAgentId, type CommsEvent } from './types.js';

const nonEmptyString = z.string().min(1);
const possiblyEmptyString = z.string();

const agentIdSchema = z.strictObject({
  agent_name: nonEmptyString,
  platform: nonEmptyString,
  model: nonEmptyString,
  session_id_prefix: nonEmptyString,
});

const legacyNarrativeSchema = z.strictObject({
  event_id: nonEmptyString,
  created_at: nonEmptyString,
  author: agentIdSchema,
  title: nonEmptyString,
  body: nonEmptyString,
  audience: z.array(nonEmptyString).optional(),
  addressed_to: nonEmptyString.optional(),
  in_response_to: nonEmptyString.optional(),
  in_reply_to: nonEmptyString.optional(),
});

const legacyLifecycleSchema = z.strictObject({
  schema_version: nonEmptyString,
  event_id: nonEmptyString,
  created_at: nonEmptyString,
  event_type: nonEmptyString,
  occurred_at: nonEmptyString,
  author: agentIdSchema,
  agent_id: agentIdSchema,
  thread: nonEmptyString,
  claim_id: possiblyEmptyString,
  title: nonEmptyString,
  subject: nonEmptyString,
  body: nonEmptyString,
});

const legacyDirectedSchema = z.strictObject({
  schema_version: nonEmptyString,
  event_id: nonEmptyString,
  created_at: nonEmptyString,
  kind: nonEmptyString,
  from: agentIdSchema,
  to: agentIdSchema,
  subject: nonEmptyString,
  body: nonEmptyString,
});

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
  io: LegacyCommsMigrationIo = filesystemLegacyCommsIo,
): Promise<number> {
  await io.ensureDirectory(input.commsDir);
  const events = migrateLegacyCommsRecords({
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

const filesystemLegacyCommsIo: LegacyCommsMigrationIo = {
  ensureDirectory: (directory) => mkdir(directory, { recursive: true }).then(() => undefined),
  readLegacyRecords,
  writeCommsEvent,
};

function migrateLegacyCommsRecords(input: {
  readonly narratives: readonly unknown[];
  readonly lifecycles: readonly unknown[];
  readonly directed: readonly unknown[];
}): readonly CommsEvent[] {
  return [
    ...input.narratives.map((value) => toNarrativeEvent(legacyNarrativeSchema.parse(value))),
    ...input.lifecycles.map((value) => toLifecycleEvent(legacyLifecycleSchema.parse(value))),
    ...input.directed.map((value) => toDirectedEvent(legacyDirectedSchema.parse(value))),
  ];
}

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

function toNarrativeEvent(value: z.output<typeof legacyNarrativeSchema>): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: value.event_id,
    created_at: value.created_at,
    kind: 'narrative',
    author: agentId(value.author),
    title: value.title,
    body: value.body,
    ...(value.audience === undefined ? {} : { audience: value.audience }),
    ...(value.addressed_to === undefined ? {} : { addressed_to: value.addressed_to }),
    ...(value.in_response_to === undefined ? {} : { in_response_to: value.in_response_to }),
    ...(value.in_reply_to === undefined ? {} : { in_reply_to: value.in_reply_to }),
  };
}

function toLifecycleEvent(value: z.output<typeof legacyLifecycleSchema>): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: value.event_id,
    created_at: value.created_at,
    kind: 'lifecycle',
    event_type: value.event_type,
    occurred_at: value.occurred_at,
    author: agentId(value.author),
    agent_id: agentId(value.agent_id),
    thread: value.thread,
    claim_id: value.claim_id,
    title: value.title,
    subject: value.subject,
    body: value.body,
  };
}

function toDirectedEvent(value: z.output<typeof legacyDirectedSchema>): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: value.event_id,
    created_at: value.created_at,
    kind: 'directed',
    message_kind: value.kind,
    from: agentId(value.from),
    to: agentId(value.to),
    subject: value.subject,
    body: value.body,
  };
}

function agentId(value: z.output<typeof agentIdSchema>): CollaborationAgentId {
  return {
    agent_name: value.agent_name,
    platform: value.platform,
    model: value.model,
    session_id_prefix: value.session_id_prefix,
  };
}
