import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

import { enforceCommsConceptGates, resolveCommsBody } from './cli-comms-commands.js';
import {
  createDirectedCommsMessage,
  replyToDirectedCommsMessage,
  sharedCommsLogPathFor,
  writeCommsEventWithReadback,
} from './comms-use-cases.js';
import { resolveIdentity } from './cli-identity.js';
import { recipientAgent } from './cli-comms-recipient.js';
import {
  nonEmptyRequired,
  optional,
  required,
  valueOrDefault,
  type Options,
} from './cli-options.js';
import { cliIo, type CollaborationStateCliIo, type CliRuntime } from './cli-runtime.js';
import { validateCommsEventTags } from './comms-tag-namespace.js';
import { registryForIdentityWrite } from './identity-write-guard.js';
import { validateSharedStateAgentId } from './identity.js';
import {
  type CollaborationAgentIdWrite,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
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
  const tags = validateCommsEventTags(options.tags);
  const inResponseTo = optional(options, 'in-response-to');
  // Sender resolution is hoisted so its write-guard registry read can be
  // reused for the recipient-prefix derivation — one read per invocation.
  const {
    agentId: from,
    registry,
    commitQueue,
  } = await currentAgent(options, env, 'comms direct', io, nowIso);
  const message = createDirectedCommsMessage({
    eventId,
    createdAt: nowIso,
    messageKind: nonEmptyRequired(options, 'kind'),
    from,
    to: recipientAgent(options, registry, commitQueue, nowIso),
    subject: nonEmptyRequired(options, 'subject'),
    body: await resolveNonEmptyBody(options, io),
    // `in_response_to` threads a directed message to an antecedent event —
    // parity with `comms send`, so a directed acknowledgement carries its
    // antecedent machine-readably instead of naming it in prose (MCP-393).
    ...(inResponseTo === undefined ? {} : { inResponseTo }),
    tags,
  });
  await enforceCommsConceptGates(io, {
    title: message.subject,
    body: message.body,
    tags: message.tags,
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
  // `comms reply` takes its recipient from the antecedent event, so it needs
  // only the guard side of the sender resolution — the registry is unused.
  const { agentId: replyFrom } = await currentAgent(options, env, 'comms reply', io, nowIso);
  // `--tag` on reply exists so the concept-gate's capture-tag exemption is
  // EXECUTABLE on this surface: replying to a legitimately-exempt capture
  // event whose subject quotes a pathogen inherits that subject ("re: ..."),
  // and without a tag option the refusal would prescribe a cure the surface
  // cannot apply.
  const message = replyToDirectedCommsMessage({
    sourceMessages: await sourceMessagesForReply(options, io),
    sourceEventId: nonEmptyRequired(options, 'to-event-id'),
    from: replyFrom,
    eventId,
    createdAt: nowIso,
    messageKind: nonEmptyRequired(options, 'kind'),
    subject: optional(options, 'subject'),
    body: await resolveNonEmptyBody(options, io),
    tags: validateCommsEventTags(options.tags),
  });
  await enforceCommsConceptGates(io, {
    title: message.subject,
    body: message.body,
    tags: message.tags,
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
    output: {
      writeText: (text) =>
        input.io.writeTextFile({ filePath: sharedCommsLogPathFor(input.commsDir), text }),
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
): Promise<{
  readonly agentId: CollaborationAgentIdWrite;
  readonly registry: CollaborationRegistry;
  readonly commitQueue: readonly CollaborationCommitQueueEntry[];
}> {
  const identity = resolveIdentity(options, env);
  const validation = validateSharedStateAgentId({ agentId: identity.agent_id, env });
  if (!validation.ok) {
    throw new Error(validation.reason);
  }
  const { registry, commitQueue } = await registryForIdentityWrite({
    options,
    agentId: identity.agent_id,
    nowIso,
    surface,
    readActiveClaimsFile: io.readActiveClaimsFile,
    readCommitQueueEntries: io.readCommitQueueEntries,
  });

  return { agentId: identity.agent_id, registry, commitQueue };
}

async function resolveNonEmptyBody(options: Options, io: CollaborationStateCliIo): Promise<string> {
  const body = (await resolveCommsBody(options, io)).trim();
  if (body.length === 0) {
    throw new Error('--body (or --body-file contents) must not be empty');
  }
  return body;
}
