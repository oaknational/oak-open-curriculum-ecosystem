import { assertUtcTimestampNotFuture } from './timestamps.js';
import {
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';

/**
 * Validate and create an immutable narrative communication event. Narrative
 * events are the only kind authored at runtime; lifecycle and directed events
 * are produced by other workflows (consolidation, handoff) and migrated
 * historically. This factory enforces UTC-ISO created_at, non-empty fields,
 * and event_id uniqueness against the existing narrative directory.
 */
export function createNarrativeCommsEvent(
  event: NarrativeCommsEvent,
  options: {
    readonly nowIso: string;
    readonly existingEventIds?: readonly string[];
  },
): NarrativeCommsEvent {
  if (options.existingEventIds?.includes(event.event_id) === true) {
    throw new Error(`communication event already exists: ${event.event_id}`);
  }
  assertUtcTimestampNotFuture({
    label: 'created_at',
    value: event.created_at,
    nowIso: options.nowIso,
  });
  validateNonEmpty('event_id', event.event_id);
  validateNonEmpty('title', event.title);
  validateNonEmpty('body', event.body);

  return event;
}

/**
 * Render the human-readable shared communication log from immutable events.
 * Accepts the three event kinds as separate arrays (one per directory); the
 * renderer merges them into a single chronological stream so that the rendered
 * log preserves the historical order across kinds.
 */
export function renderSharedCommsLog(input: {
  readonly narrative: readonly NarrativeCommsEvent[];
  readonly lifecycle: readonly LifecycleCommsEvent[];
  readonly directed: readonly DirectedCommsMessage[];
}): string {
  const entries: readonly RenderEntry[] = [
    ...input.narrative.map((event) => ({
      created_at: event.created_at,
      event_id: event.event_id,
      rendered: renderNarrativeEvent(event),
    })),
    ...input.lifecycle.map((event) => ({
      created_at: event.created_at,
      event_id: event.event_id,
      rendered: renderLifecycleEvent(event),
    })),
    ...input.directed.map((event) => ({
      created_at: event.created_at,
      event_id: event.event_id,
      rendered: renderDirectedMessage(event),
    })),
  ];
  const sections = entries.toSorted(compareByTime).map((entry) => entry.rendered);
  const header = [
    '---',
    'merge_class: append-only-narrative',
    '---',
    '',
    '# Agent-to-Agent Shared Communication Log',
    '',
    '> Generated from `.agent/state/collaboration/comms-events/`,',
    '> `.agent/state/collaboration/comms-lifecycle/`, and',
    '> `.agent/state/collaboration/comms-messages/`.',
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
      `\`${event.to.agent_name}\` — [directed:${event.kind}] ${event.subject}`,
    '',
    event.body,
  ].join('\n');
}

function validateNonEmpty(label: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be non-empty`);
  }
}
