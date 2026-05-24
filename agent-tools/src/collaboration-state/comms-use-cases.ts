import { renderSharedCommsLog } from './comms.js';
import { type CollaborationAgentId, type CommsEvent, type DirectedCommsMessage } from './types.js';

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

export function createDirectedCommsMessage(input: {
  readonly eventId: string;
  readonly createdAt: string;
  readonly messageKind: string;
  readonly from: CollaborationAgentId;
  readonly to: CollaborationAgentId;
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

export function replyToDirectedCommsMessage(input: {
  readonly sourceMessages: readonly DirectedCommsMessage[];
  readonly sourceEventId: string;
  readonly from: CollaborationAgentId;
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
    to: source.from,
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
