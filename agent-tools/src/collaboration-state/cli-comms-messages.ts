import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveIdentity } from './cli-identity.js';
import { optional, required, valueOrDefault, type Options } from './cli-options.js';
import { assertIdentityCanWrite } from './identity-write-guard.js';
import { validateSharedStateAgentId } from './identity.js';
import { readDirectedCommsMessages } from './state-io.js';
import {
  type CollaborationAgentId,
  type CollaborationStateEnvironment,
  type DirectedCommsMessage,
} from './types.js';

const DIRECTED_COMMS_SCHEMA_VERSION = '1.0.0';
const MAX_REPLY_SUBJECT_LENGTH = 200;

/**
 * Author a first-strike directed comms message and prove it is readable by the
 * same parser used by `comms inbox`.
 */
export async function directComms(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const message: DirectedCommsMessage = {
    schema_version: DIRECTED_COMMS_SCHEMA_VERSION,
    event_id: eventId,
    created_at: valueOrDefault(options, 'now', new Date().toISOString()),
    kind: nonEmptyRequired(options, 'kind'),
    from: await currentAgent(options, env, 'comms direct'),
    to: recipientAgent(options),
    subject: nonEmptyRequired(options, 'subject'),
    body: nonEmptyRequired(options, 'body'),
  };

  return writeDirectedMessage({ messagesDir: required(options, 'messages-dir'), message });
}

/**
 * Author a directed reply by swapping the source message's sender and recipient.
 */
export async function replyComms(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const source = await sourceMessageForReply(options);
  const from = await currentAgent(options, env, 'comms reply');
  assertSameAgent(from, source.to);
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const message: DirectedCommsMessage = {
    schema_version: DIRECTED_COMMS_SCHEMA_VERSION,
    event_id: eventId,
    created_at: valueOrDefault(options, 'now', new Date().toISOString()),
    kind: nonEmptyRequired(options, 'kind'),
    from,
    to: source.from,
    subject: optional(options, 'subject') ?? defaultReplySubject(source.subject),
    body: nonEmptyRequired(options, 'body'),
  };

  return writeDirectedMessage({ messagesDir: required(options, 'messages-dir'), message });
}

async function writeDirectedMessage(input: {
  readonly messagesDir: string;
  readonly message: DirectedCommsMessage;
}): Promise<string> {
  await mkdir(input.messagesDir, { recursive: true });
  const path = join(input.messagesDir, `${input.message.event_id}.json`);
  await writeFile(path, `${JSON.stringify(input.message, null, 2)}\n`, { flag: 'wx' });
  const written = await readDirectedCommsMessages(input.messagesDir);
  if (!written.some((message) => message.event_id === input.message.event_id)) {
    throw new Error(`directed message readback failed for ${input.message.event_id}`);
  }

  return `wrote directed message ${input.message.event_id} to ${path}\n`;
}

async function sourceMessageForReply(options: Options): Promise<DirectedCommsMessage> {
  const sourceEventId = nonEmptyRequired(options, 'to-event-id');
  const messages = await readDirectedCommsMessages(required(options, 'messages-dir'));
  const source = messages.find((message) => message.event_id === sourceEventId);
  if (source === undefined) {
    throw new Error(`directed message not found: ${sourceEventId}`);
  }

  return source;
}

async function currentAgent(
  options: Options,
  env: CollaborationStateEnvironment,
  surface: string,
): Promise<CollaborationAgentId> {
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  await assertIdentityCanWrite({
    options,
    agentId: identity.agent_id,
    nowIso: valueOrDefault(options, 'now', new Date().toISOString()),
    surface,
  });

  return identity.agent_id;
}

function recipientAgent(options: Options): CollaborationAgentId {
  return {
    agent_name: nonEmptyRequired(options, 'to-agent-name'),
    platform: nonEmptyRequired(options, 'to-platform'),
    model: nonEmptyRequired(options, 'to-model'),
    session_id_prefix: nonEmptyRequired(options, 'to-session-prefix'),
  };
}

function nonEmptyRequired(options: Options, key: string): string {
  const value = required(options, key).trim();
  if (value.length === 0) {
    throw new Error(`--${key} must not be empty`);
  }

  return value;
}

function defaultReplySubject(sourceSubject: string): string {
  const prefixed = sourceSubject.toLowerCase().startsWith('re: ')
    ? sourceSubject
    : `re: ${sourceSubject}`;
  return prefixed.slice(0, MAX_REPLY_SUBJECT_LENGTH);
}

function assertSameAgent(actual: CollaborationAgentId, expected: CollaborationAgentId): void {
  if (
    actual.agent_name !== expected.agent_name ||
    actual.platform !== expected.platform ||
    actual.session_id_prefix !== expected.session_id_prefix
  ) {
    throw new Error(
      `current identity ${formatAgent(actual)} cannot reply to message addressed to ${formatAgent(expected)}`,
    );
  }
}

function formatAgent(agent: CollaborationAgentId): string {
  return `${agent.agent_name} / ${agent.platform} / ${agent.model} / ${agent.session_id_prefix}`;
}
