import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

import { renderSharedCommsLog } from './comms.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, valueOrDefault, type Options } from './cli-options.js';
import { validateSharedStateAgentId } from './identity.js';
import {
  readDirectedCommsMessages,
  readLifecycleCommsEvents,
  readNarrativeCommsEvents,
  writeNarrativeCommsEvent,
} from './state-io.js';
import { writeTextFileAtomically } from './transaction.js';
import { type CollaborationStateEnvironment } from './types.js';

const DEFAULT_EVENTS_DIR = '.agent/state/collaboration/comms-events';
const DEFAULT_LIFECYCLE_DIR = '.agent/state/collaboration/comms-lifecycle';
const DEFAULT_MESSAGES_DIR = '.agent/state/collaboration/comms-messages';
const DEFAULT_SHARED_LOG = '.agent/state/collaboration/shared-comms-log.md';

export async function appendComms(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }

  await writeNarrativeCommsEvent({
    eventsDir: required(options, 'events-dir'),
    nowIso: required(options, 'now'),
    event: {
      event_id: valueOrDefault(options, 'event-id', randomUUID()),
      created_at: required(options, 'created-at'),
      author: identity.agent_id,
      title: required(options, 'title'),
      body: required(options, 'body'),
    },
  });

  return '';
}

export async function renderComms(options: Options): Promise<string> {
  const narrative = await readNarrativeCommsEvents(required(options, 'events-dir'));
  const lifecycle = await readLifecycleCommsEvents(required(options, 'lifecycle-dir'));
  const directed = await readDirectedCommsMessages(required(options, 'messages-dir'));
  await writeTextFileAtomically({
    filePath: required(options, 'output'),
    text: renderSharedCommsLog({ narrative, lifecycle, directed }),
  });

  return '';
}

export async function sendComms(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const nowIso = optional(options, 'now') ?? new Date().toISOString();
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const defaults = commsSendDefaults(options, nowIso, eventId);
  const resolvedOptions = withDefaults(options, defaults);
  await appendComms(resolvedOptions, env);
  await renderComms(resolvedOptions);

  return formatCommsSendResult(resolvedOptions, eventId);
}

export function commsSendDefaults(
  options: Options,
  nowIso: string,
  eventId: string,
): Readonly<Record<string, string>> {
  const repoRoot = collaborationRepoRoot(options);
  return {
    'events-dir': join(repoRoot, DEFAULT_EVENTS_DIR),
    'lifecycle-dir': join(repoRoot, DEFAULT_LIFECYCLE_DIR),
    'messages-dir': join(repoRoot, DEFAULT_MESSAGES_DIR),
    now: nowIso,
    'created-at': nowIso,
    'event-id': eventId,
    output: join(repoRoot, DEFAULT_SHARED_LOG),
  };
}

function collaborationRepoRoot(options: Options): string {
  return optional(options, 'repo-root') ?? findCollaborationRepoRoot(process.cwd());
}

export function formatCommsSendResult(options: Options, eventId: string): string {
  return `${JSON.stringify(commsSendResult(options, eventId), null, 2)}\n`;
}

function commsSendResult(
  options: Options,
  eventId: string,
): Readonly<{
  readonly event_id: string;
  readonly event_path: string;
  readonly shared_log_path: string;
}> {
  return {
    event_id: eventId,
    event_path: join(required(options, 'events-dir'), `${eventId}.json`),
    shared_log_path: required(options, 'output'),
  };
}

function findCollaborationRepoRoot(start: string): string {
  let current = start;
  const root = parse(start).root;
  while (true) {
    if (existsSync(join(current, '.agent', 'state', 'collaboration'))) {
      return current;
    }
    if (current === root) {
      return start;
    }
    current = dirname(current);
  }
}

function withDefaults(options: Options, defaults: Readonly<Record<string, string>>): Options {
  const values = new Map(options.values);
  for (const key in defaults) {
    if (!values.has(key)) {
      values.set(key, defaults[key] ?? '');
    }
  }

  return { ...options, values };
}
