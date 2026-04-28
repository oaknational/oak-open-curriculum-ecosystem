import { assertUtcTimestampNotFuture } from './timestamps.js';
import { type CommsEvent } from './types.js';

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
  validateNonEmpty('title', event.title);
  validateNonEmpty('body', event.body);

  return event;
}

/**
 * Render the human-readable shared communication log from immutable events.
 */
export function renderSharedCommsLog(input: { readonly events: readonly CommsEvent[] }): string {
  const sections = input.events.toSorted(compareEvents).map(renderEvent);
  const header = [
    '# Agent-to-Agent Shared Communication Log',
    '',
    '> Generated from `.agent/state/collaboration/comms/events/`.',
    '> Archived rendered history lives under `.agent/state/collaboration/comms/archive/`.',
    '',
    '',
  ].join('\n');

  return `${header}${sections.join('\n\n---\n\n')}\n`;
}

function compareEvents(left: CommsEvent, right: CommsEvent): number {
  const byTime = Date.parse(left.created_at) - Date.parse(right.created_at);
  if (byTime !== 0) {
    return byTime;
  }

  return left.event_id.localeCompare(right.event_id);
}

function renderEvent(event: CommsEvent): string {
  return [
    `## ${event.created_at} — \`${event.author.agent_name}\` / ` +
      `\`${event.author.platform}\` / \`${event.author.model}\` / ` +
      `\`${event.author.session_id_prefix}\` — ${event.title}`,
    '',
    event.body,
  ].join('\n');
}

function validateNonEmpty(label: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be non-empty`);
  }
}
