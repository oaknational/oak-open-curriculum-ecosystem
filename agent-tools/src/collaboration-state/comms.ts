import { assertUtcTimestampNotFuture } from './timestamps.js';
import {
  type CommsEvent,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';

/**
 * Validate and create an immutable communication event.
 */
export function createCommsEvent(
  event: CommsEvent,
  options: {
    readonly nowIso: string;
    readonly existingEventIds?: readonly string[];
  },
): CommsEvent {
  if (options.existingEventIds?.includes(event.event_id) === true) {
    throw new Error(`communication event already exists: ${event.event_id}`);
  }
  assertUtcTimestampNotFuture({
    label: 'created_at',
    value: event.created_at,
    nowIso: options.nowIso,
  });
  validateNonEmpty('event_id', event.event_id);
  validateNonEmpty('schema_version', event.schema_version);
  validateNonEmpty('body', event.body);
  if (event.schema_version !== '2.0.0') {
    throw new Error('communication event must use schema_version 2.0.0');
  }
  if (event.kind === 'narrative' || event.kind === 'lifecycle') {
    validateNonEmpty('title', event.title);
  }
  if (event.kind === 'directed') {
    validateNonEmpty('message_kind', event.message_kind);
  }

  return event;
}

/**
 * Render the human-readable shared communication log from immutable events.
 */
export function renderSharedCommsLog(input: { readonly events: readonly CommsEvent[] }): string {
  const entries = input.events.map(renderEntry);
  const sections = entries.toSorted(compareByTime).map((entry) => entry.rendered);
  const header = [
    '---',
    'merge_class: append-only-narrative',
    '---',
    '',
    '# Agent-to-Agent Shared Communication Log',
    '',
    '> Generated from `.agent/state/collaboration/comms/`.',
    '',
    '',
  ].join('\n');

  return `${header}${sections.join('\n\n---\n\n')}\n`;
}

interface RenderEntry {
  readonly created_at: string;
  readonly event_id: string;
  readonly rendered: string;
}

function renderEntry(event: CommsEvent): RenderEntry {
  if (event.kind === 'narrative') {
    return {
      created_at: event.created_at,
      event_id: event.event_id,
      rendered: renderNarrativeEvent(event),
    };
  }
  if (event.kind === 'lifecycle') {
    return {
      created_at: event.created_at,
      event_id: event.event_id,
      rendered: renderLifecycleEvent(event),
    };
  }

  return {
    created_at: event.created_at,
    event_id: event.event_id,
    rendered: renderDirectedMessage(event),
  };
}

function compareByTime(left: RenderEntry, right: RenderEntry): number {
  const byTime = Date.parse(left.created_at) - Date.parse(right.created_at);
  if (byTime !== 0) {
    return byTime;
  }

  if (left.event_id < right.event_id) {
    return -1;
  }
  if (left.event_id > right.event_id) {
    return 1;
  }

  return 0;
}

function renderNarrativeEvent(event: NarrativeCommsEvent): string {
  return [
    `## ${event.created_at} — \`${event.author.agent_name}\` / ` +
      `\`${event.author.platform}\` / \`${event.author.model}\` / ` +
      `\`${event.author.session_id_prefix}\` — ${event.title}`,
    '',
    event.body,
  ].join('\n');
}

function renderLifecycleEvent(event: LifecycleCommsEvent): string {
  return [
    `## ${event.created_at} — \`${event.author.agent_name}\` / ` +
      `\`${event.author.platform}\` / \`${event.author.model}\` / ` +
      `\`${event.author.session_id_prefix}\` — ` +
      `[lifecycle:${event.event_type}] ${event.title}`,
    '',
    event.body,
  ].join('\n');
}

function renderDirectedMessage(event: DirectedCommsMessage): string {
  return [
    `## ${event.created_at} — \`${event.from.agent_name}\` → ` +
      `\`${event.to.agent_name}\` — [directed:${event.message_kind}] ${event.subject}`,
    '',
    event.body,
  ].join('\n');
}

function validateNonEmpty(label: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be non-empty`);
  }
}
