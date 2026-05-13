import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import {
  createDirectedCommsMessage,
  replyToDirectedCommsMessage,
  writeCommsEventWithReadback,
} from './comms-use-cases.js';
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

/**
 * Author a first-strike directed comms message and prove it is readable by the
 * same parser used by `comms inbox`.
 */
export async function directComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const nowIso = valueOrDefault(options, 'now', new Date().toISOString());
  const message = createDirectedCommsMessage({
    eventId,
    createdAt: nowIso,
    messageKind: nonEmptyRequired(options, 'kind'),
    from: await currentAgent(options, env, 'comms direct', io, nowIso),
    to: recipientAgent(options),
    subject: nonEmptyRequired(options, 'subject'),
    body: nonEmptyRequired(options, 'body'),
  });

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
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const eventId = valueOrDefault(options, 'event-id', randomUUID());
  const nowIso = valueOrDefault(options, 'now', new Date().toISOString());
  const message = replyToDirectedCommsMessage({
    sourceMessages: await sourceMessagesForReply(options, io),
    sourceEventId: nonEmptyRequired(options, 'to-event-id'),
    from: await currentAgent(options, env, 'comms reply', io, nowIso),
    eventId,
    createdAt: nowIso,
    messageKind: nonEmptyRequired(options, 'kind'),
    subject: optional(options, 'subject'),
    body: nonEmptyRequired(options, 'body'),
  });

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
  await writeCommsEventWithReadback({
    event: input.message,
    nowIso: input.nowIso,
    store: {
      write: (event, currentNowIso) =>
        input.io.writeCommsEvent({
          commsDir: input.commsDir,
          nowIso: currentNowIso,
          event,
        }),
      read: () => input.io.readCommsEvents(input.commsDir),
    },
  });

  return `wrote comms event ${input.message.event_id} to ${path}\n`;
}

async function sourceMessagesForReply(
  options: Options,
  io: CollaborationStateCliIo,
): Promise<readonly DirectedCommsMessage[]> {
  return io.readDirectedCommsMessages(required(options, 'comms-dir'));
}

async function currentAgent(
  options: Options,
  env: CollaborationStateEnvironment,
  surface: string,
  io: CollaborationStateCliIo,
  nowIso: string,
): Promise<CollaborationAgentId> {
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  await assertIdentityCanWrite({
    options,
    agentId: identity.agent_id,
    nowIso,
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
