import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import { resolveIdentity } from './cli-identity.js';
import { optional, required, valueOrDefault, type Options } from './cli-options.js';
import { cliIo, type CollaborationStateCliIo, type CliRuntime } from './cli-runtime.js';
import { assertIdentityCanWrite } from './identity-write-guard.js';
import { validateSharedStateAgentId } from './identity.js';
import {
  type CollaborationAgentId,
  type CollaborationStateEnvironment,
  type DirectedCommsMessage,
} from './types.js';

const MAX_REPLY_SUBJECT_LENGTH = 200;

/**
 * Author a first-strike directed comms message and prove it is readable by the
 * same parser used by `comms inbox`.
 */
export async function directComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime = {},
): Promise<string> {
  const io = cliIo(runtime);
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const nowIso = valueOrDefault(options, 'now', new Date().toISOString());
  const message: DirectedCommsMessage = {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: nowIso,
    kind: 'directed',
    message_kind: nonEmptyRequired(options, 'kind'),
    from: await currentAgent(options, env, 'comms direct', io),
    to: recipientAgent(options),
    subject: nonEmptyRequired(options, 'subject'),
    body: nonEmptyRequired(options, 'body'),
  };

  return writeDirectedMessage({
    commsDir: required(options, 'comms-dir'),
    nowIso,
    message,
    io,
  });
}

/**
 * Author a directed reply by swapping the source message's sender and recipient.
 */
export async function replyComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime = {},
): Promise<string> {
  const io = cliIo(runtime);
  const source = await sourceMessageForReply(options, io);
  const from = await currentAgent(options, env, 'comms reply', io);
  assertSameAgent(from, source.to);
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const nowIso = valueOrDefault(options, 'now', new Date().toISOString());
  const message: DirectedCommsMessage = {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: nowIso,
    kind: 'directed',
    message_kind: nonEmptyRequired(options, 'kind'),
    from,
    to: source.from,
    subject: optional(options, 'subject') ?? defaultReplySubject(source.subject),
    body: nonEmptyRequired(options, 'body'),
  };

  return writeDirectedMessage({
    commsDir: required(options, 'comms-dir'),
    nowIso,
    message,
    io,
  });
}

async function writeDirectedMessage(input: {
  readonly commsDir: string;
  readonly nowIso: string;
  readonly message: DirectedCommsMessage;
  readonly io: CollaborationStateCliIo;
}): Promise<string> {
  const path = join(input.commsDir, `${input.message.event_id}.json`);
  await input.io.writeCommsEvent({
    commsDir: input.commsDir,
    nowIso: input.nowIso,
    event: input.message,
  });
  const written = await input.io.readDirectedCommsMessages(input.commsDir);
  if (!written.some((message) => message.event_id === input.message.event_id)) {
    throw new Error(`directed message readback failed for ${input.message.event_id}`);
  }

  return `wrote comms event ${input.message.event_id} to ${path}\n`;
}

async function sourceMessageForReply(
  options: Options,
  io: CollaborationStateCliIo,
): Promise<DirectedCommsMessage> {
  const sourceEventId = nonEmptyRequired(options, 'to-event-id');
  const messages = await io.readDirectedCommsMessages(required(options, 'comms-dir'));
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
  io: CollaborationStateCliIo,
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
    readActiveClaimsFile: io.readActiveClaimsFile,
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
