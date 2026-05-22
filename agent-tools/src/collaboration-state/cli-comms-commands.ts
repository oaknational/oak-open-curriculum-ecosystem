import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';

import { renderCommsLog, writeCommsEventWithReadback } from './comms-use-cases.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, valueOrDefault, type Options } from './cli-options.js';
import { cliIo, type CollaborationStateCliIo, type CliRuntime } from './cli-runtime.js';
import { assertIdentityCanWrite } from './identity-write-guard.js';
import { validateSharedStateAgentId } from './identity.js';
import { type CollaborationStateEnvironment } from './types.js';

const DEFAULT_COMMS_DIR = '.agent/state/collaboration/comms';
const DEFAULT_SHARED_LOG = '.agent/state/collaboration/shared-comms-log.md';

/**
 * Resolve the event body from either `--body` (inline string) or
 * `--body-file <path>` (file contents read literally, no shell interpretation).
 *
 * The file path is the cure for shell-quoting hazards on inline bodies that
 * contain backticks, dollar-signs, or other shell-special characters.
 *
 * Errors:
 * - Both flags set: rejected as mutually exclusive.
 * - Neither flag set: rejected as missing required `--body`.
 * - File unreadable: error message names the offending path.
 */
export async function resolveCommsBody(
  options: Options,
  io: CollaborationStateCliIo,
): Promise<string> {
  const inline = optional(options, 'body');
  const filePath = optional(options, 'body-file');
  if (inline !== undefined && filePath !== undefined) {
    throw new Error('--body and --body-file are mutually exclusive');
  }
  if (filePath !== undefined) {
    try {
      return await io.readTextFile(filePath);
    } catch (cause) {
      throw new Error(`--body-file path is unreadable: ${filePath}`, { cause });
    }
  }
  if (inline === undefined) {
    throw new Error('missing required option --body (or pass --body-file <path>)');
  }
  return inline;
}

export async function appendComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const nowIso = required(options, 'now');
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  await assertIdentityCanWrite({
    options,
    agentId: identity.agent_id,
    nowIso,
    surface: 'comms append',
    readActiveClaimsFile: io.readActiveClaimsFile,
  });

  const body = await resolveCommsBody(options, io);
  await writeCommsEventWithReadback({
    nowIso,
    store: {
      write: (event, currentNowIso) =>
        io.writeCommsEvent({ commsDir, event, nowIso: currentNowIso }),
      read: () => io.readCommsEvents(commsDir),
    },
    event: {
      schema_version: '2.0.0',
      event_id: valueOrDefault(options, 'event-id', randomUUID()),
      created_at: required(options, 'created-at'),
      kind: 'narrative',
      author: identity.agent_id,
      title: required(options, 'title'),
      body,
    },
  });

  return '';
}

export async function renderComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  await renderCommsLog({
    store: { read: () => io.readCommsEvents(commsDir) },
    output: {
      writeText: (text) => io.writeTextFile({ filePath: required(options, 'output'), text }),
    },
  });

  return '';
}

export async function migrateComms(
  options: Options,
  _env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const migrated = await cliIo(runtime).migrateLegacyCommsDirectories({
    eventsDir: required(options, 'events-dir'),
    lifecycleDir: required(options, 'lifecycle-dir'),
    messagesDir: required(options, 'messages-dir'),
    commsDir: required(options, 'comms-dir'),
  });

  return `migrated ${migrated} comms events\n`;
}

export async function sendComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const nowIso = optional(options, 'now') ?? new Date().toISOString();
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const defaults = commsSendDefaults(options, nowIso, eventId);
  const resolvedOptions = withDefaults(options, defaults);
  await appendComms(resolvedOptions, env, runtime);
  await renderComms(resolvedOptions, env, runtime);

  return formatCommsSendResult(resolvedOptions, eventId);
}

export function commsSendDefaults(
  options: Options,
  nowIso: string,
  eventId: string,
): Readonly<Record<string, string>> {
  const repoRoot = collaborationRepoRoot(options);
  return {
    'comms-dir': join(repoRoot, DEFAULT_COMMS_DIR),
    now: nowIso,
    'created-at': nowIso,
    'event-id': eventId,
    output: join(repoRoot, DEFAULT_SHARED_LOG),
    active: join(repoRoot, '.agent/state/collaboration/active-claims.json'),
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
    event_path: join(required(options, 'comms-dir'), `${eventId}.json`),
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
