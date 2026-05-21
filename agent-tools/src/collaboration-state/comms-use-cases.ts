import { renderSharedCommsLog } from './comms.js';
import {
  type CollaborationAgentId,
  type CommsEvent,
  type DirectedCommsMessage,
  type DirectedInboxDrainResult,
} from './types.js';

export { migrateLegacyCommsRecordCollections } from './comms-migration-records.js';
export { classifyEventForAgent, drainRelevantEvents } from './comms-relevant-events.js';

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
}): DirectedCommsMessage {
  return {
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

export async function drainDirectedInbox(input: {
  readonly messages: readonly CommsEvent[];
  readonly seenIds: ReadonlySet<string>;
  readonly agentName: string;
  readonly sessionPrefix?: string;
  readonly remainingEvents?: number;
  readonly markSeen: (eventIds: readonly string[]) => Promise<void>;
}): Promise<DirectedInboxDrainResult> {
  const unseen = input.messages
    .filter(isDirectedCommsMessage)
    .filter((message) => messageMatchesRecipient(message, input.agentName, input.sessionPrefix))
    .filter((message) => !input.seenIds.has(message.event_id))
    .toSorted(compareDirectedMessages)
    .slice(0, input.remainingEvents);

  if (unseen.length === 0) {
    return { output: '', eventCount: 0 };
  }

  await input.markSeen(unseen.map((message) => message.event_id));

  return {
    output: unseen.map(formatDirectedMessage).join('\n'),
    eventCount: unseen.length,
  };
}

export async function watchDirectedInbox(input: {
  readonly maxEvents?: number;
  readonly drain: (remainingEvents?: number) => Promise<DirectedInboxDrainResult>;
  readonly waitForChange: () => Promise<void>;
  readonly emit: (text: string) => Promise<void>;
}): Promise<string> {
  let emitted = 0;
  let output = '';

  while (needsMoreEvents({ emitted, maxEvents: input.maxEvents })) {
    const result = await input.drain(remainingEvents({ emitted, maxEvents: input.maxEvents }));
    output += result.output;
    emitted += result.eventCount;
    await input.emit(result.output);

    if (needsMoreEvents({ emitted, maxEvents: input.maxEvents })) {
      await input.waitForChange();
    }
  }

  return output;
}

function messageMatchesRecipient(
  message: DirectedCommsMessage,
  agentName: string,
  sessionPrefix?: string,
): boolean {
  const nameMatches = agentName === '*' || message.to.agent_name === agentName;
  const sessionMatches =
    sessionPrefix === undefined || message.to.session_id_prefix === sessionPrefix;
  return nameMatches && sessionMatches;
}

function compareDirectedMessages(left: DirectedCommsMessage, right: DirectedCommsMessage): number {
  const byTime = Date.parse(left.created_at) - Date.parse(right.created_at);
  if (byTime !== 0) {
    return byTime;
  }

  return left.event_id.localeCompare(right.event_id);
}

function formatDirectedMessage(message: DirectedCommsMessage): string {
  return [
    '--- NEW DIRECTED MESSAGE ---',
    `from: ${message.from.agent_name} / ${message.from.platform} / ${message.from.session_id_prefix}`,
    `subject: ${message.subject}`,
    `created_at: ${message.created_at}`,
    '',
    message.body,
    '--- END MESSAGE ---',
    '',
  ].join('\n');
}

function needsMoreEvents(input: {
  readonly emitted: number;
  readonly maxEvents: number | undefined;
}): boolean {
  return input.maxEvents === undefined || input.emitted < input.maxEvents;
}

function remainingEvents(input: {
  readonly emitted: number;
  readonly maxEvents: number | undefined;
}): number | undefined {
  return input.maxEvents === undefined ? undefined : input.maxEvents - input.emitted;
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

function isDirectedCommsMessage(event: CommsEvent): event is DirectedCommsMessage {
  return event.kind === 'directed';
}
