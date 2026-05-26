import { sameAgentRoutingKey } from './active-agent-routing.js';
import { renderSharedCommsLog } from './comms.js';
import {
  type CollaborationAgentId,
  type CollaborationAgentIdWrite,
  collaborationAgentIdWriteSchema,
  type CommsEvent,
  type DirectedCommsMessage,
} from './types.js';

export { migrateLegacyCommsRecordCollections } from './comms-migration-records.js';
export { classifyEventForAgent, drainRelevantEvents } from './comms-relevant-events.js';
export { watchCommsLoop, type WatcherTickStatus } from './comms-watch-loop.js';

const MAX_REPLY_SUBJECT_LENGTH = 200;

export interface CommsEventStore {
  readonly write: (event: CommsEvent, nowIso: string) => Promise<void>;
  readonly read: () => Promise<readonly CommsEvent[]>;
}

export interface CommsTextOutput {
  readonly writeText: (text: string) => Promise<void>;
}

/**
 * Construct a directed comms message at the write boundary.
 *
 * `from` and `to` are typed as `CollaborationAgentIdWrite` (PDR-076a
 * Phase 0C Cycle 11): every directed message written after Phase 0 MUST
 * carry an id on both endpoints so the routing comparators can
 * distinguish same-name + same-prefix + different-id agents at the
 * receive side. The compile-time write-shape requirement closes the
 * type-safety hole at the factory entry point — callers cannot
 * accidentally bypass `recipientAgent`/identity derivation and construct
 * a legacy-shape directed message.
 *
 * The stored `DirectedCommsMessage` interface keeps the loose
 * `CollaborationAgentId` field shape so the migration path
 * (`comms-migration-records.ts`) can still produce legacy-shape directed
 * events from pre-Phase-0 data on disk. The cure is at the WRITE
 * factory, not the stored schema.
 */
export function createDirectedCommsMessage(input: {
  readonly eventId: string;
  readonly createdAt: string;
  readonly messageKind: string;
  readonly from: CollaborationAgentIdWrite;
  readonly to: CollaborationAgentIdWrite;
  readonly subject: string;
  readonly body: string;
  readonly tags?: readonly string[];
}): DirectedCommsMessage {
  const base: DirectedCommsMessage = {
    schema_version: '2.0.0',
    event_id: input.eventId,
    created_at: input.createdAt,
    kind: 'directed',
    message_kind: input.messageKind,
    from: input.from,
    to: input.to,
    subject: input.subject,
    body: input.body,
  };
  return input.tags !== undefined && input.tags.length > 0 ? { ...base, tags: input.tags } : base;
}

export async function writeCommsEventWithReadback(input: {
  readonly event: CommsEvent;
  readonly nowIso: string;
  readonly store: CommsEventStore;
}): Promise<CommsEvent> {
  await input.store.write(input.event, input.nowIso);
  const written = await input.store.read();
  if (!written.some((event) => event.event_id === input.event.event_id)) {
    throw new Error(`comms event readback failed for ${input.event.event_id}`);
  }

  return input.event;
}

/**
 * Build a reply to a previously written directed message.
 *
 * `from` is typed as `CollaborationAgentIdWrite` because every Phase 0+
 * write must carry an id. The source message's `from` field is loose on
 * the read side (legacy events on disk may lack ids), so this function
 * parses `source.from` through `collaborationAgentIdWriteSchema` before
 * passing it as the reply's `to`. A legacy source (whose `from` lacks
 * an id) cannot be replied to via the id-keyed write path — the parse
 * throws with a Zod error naming the missing id. That is the correct
 * architectural behaviour: replying to a legacy-shape source would
 * silently reintroduce the named failure mode if the reply's `to` were
 * permitted to lack an id.
 */
export function replyToDirectedCommsMessage(input: {
  readonly sourceMessages: readonly DirectedCommsMessage[];
  readonly sourceEventId: string;
  readonly from: CollaborationAgentIdWrite;
  readonly eventId: string;
  readonly createdAt: string;
  readonly messageKind: string;
  readonly subject?: string;
  readonly body: string;
}): DirectedCommsMessage {
  const source = input.sourceMessages.find((message) => message.event_id === input.sourceEventId);
  if (source === undefined) {
    throw new Error(`directed message not found: ${input.sourceEventId}`);
  }
  assertSameAgent(input.from, source.to);

  return createDirectedCommsMessage({
    eventId: input.eventId,
    createdAt: input.createdAt,
    messageKind: input.messageKind,
    from: input.from,
    to: collaborationAgentIdWriteSchema.parse(source.from),
    subject: input.subject ?? defaultReplySubject(source.subject),
    body: input.body,
  });
}

export async function renderCommsLog(input: {
  readonly store: Pick<CommsEventStore, 'read'>;
  readonly output: CommsTextOutput;
}): Promise<string> {
  const text = renderSharedCommsLog({ events: await input.store.read() });
  await input.output.writeText(text);

  return text;
}

function defaultReplySubject(sourceSubject: string): string {
  const prefixed = sourceSubject.toLowerCase().startsWith('re: ')
    ? sourceSubject
    : `re: ${sourceSubject}`;
  return prefixed.slice(0, MAX_REPLY_SUBJECT_LENGTH);
}

function assertSameAgent(actual: CollaborationAgentId, expected: CollaborationAgentId): void {
  // PDR-076a id-aware reply authorisation. Two agents with the same name +
  // prefix but different ids must NOT be able to reply to each other's
  // messages; sameAgentRoutingKey enforces the cross-id rejection.
  if (!sameAgentRoutingKey(actual, expected)) {
    throw new Error(
      `current identity ${formatAgent(actual)} cannot reply to message addressed to ${formatAgent(expected)}`,
    );
  }
}

function formatAgent(agent: CollaborationAgentId): string {
  return `${agent.agent_name} / ${agent.platform} / ${agent.model} / ${agent.session_id_prefix}`;
}
