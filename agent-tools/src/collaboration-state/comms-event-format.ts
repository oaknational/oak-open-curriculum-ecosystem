/**
 * Watcher/inbox rendering of classified comms events — the per-event
 * header marker line and the per-kind body layouts. Extracted from
 * `comms-relevant-events.ts` so classification stays a pure view module
 * and formatting owns its own surface.
 *
 * @packageDocumentation
 */
import {
  type CollaborationAgentId,
  type CommsEvent,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';
import { type EventView } from './comms-event-views.js';

export function formatClassifiedEvent(entry: {
  readonly event: CommsEvent;
  readonly view: EventView;
}): string {
  if (entry.event.kind === 'directed') {
    return formatClassifiedDirected(entry.event, entry.view);
  }
  if (entry.event.kind === 'lifecycle') {
    return formatClassifiedLifecycle(entry.event);
  }
  return formatClassifiedNarrative(entry.event, entry.view);
}

/**
 * Compose the watcher's per-event header marker line.
 *
 * - When `tags` is `undefined` or empty, emits `--- NEW [VIEW] EVENT ---`.
 * - When `tags` is present, sorts a copy alphabetically (input untouched),
 *   uppercases each entry, and composes
 *   `--- NEW [VIEW] [TAG1] [TAG2] EVENT ---`.
 *
 * Unknown tag strings render literal-normalised — no allowlist at render
 * time. Write-time validation handles namespace enforcement at a different
 * layer.
 */
export function formatWatcherEventHeader(
  view: EventView,
  tags: readonly string[] | undefined,
): string {
  const viewToken = `[${view.toUpperCase()}]`;
  if (tags === undefined || tags.length === 0) {
    return `--- NEW ${viewToken} EVENT ---`;
  }
  const tagTokens = [...tags]
    .sort((left, right) => left.localeCompare(right))
    .map((tag) => `[${tag.toUpperCase()}]`)
    .join(' ');
  return `--- NEW ${viewToken} ${tagTokens} EVENT ---`;
}

function formatClassifiedDirected(event: DirectedCommsMessage, view: EventView): string {
  return [
    formatWatcherEventHeader(view, event.tags),
    `from: ${formatIdentity(event.from)}`,
    `to: ${formatIdentity(event.to)}`,
    `subject: ${event.subject}`,
    `created_at: ${event.created_at}`,
    '',
    event.body,
    '--- END EVENT ---',
    '',
  ].join('\n');
}

function formatClassifiedNarrative(event: NarrativeCommsEvent, view: EventView): string {
  return [
    formatWatcherEventHeader(view, event.tags),
    `from: ${formatIdentity(event.author)}`,
    `to: ${formatNarrativeAddressee(event)}`,
    `title: ${event.title}`,
    `created_at: ${event.created_at}`,
    '',
    event.body,
    '--- END EVENT ---',
    '',
  ].join('\n');
}

function formatClassifiedLifecycle(event: LifecycleCommsEvent): string {
  return [
    formatWatcherEventHeader('lifecycle', event.tags),
    `from: ${formatIdentity(event.author)}`,
    `event_type: ${event.event_type}`,
    `thread: ${event.thread}`,
    `title: ${event.title}`,
    `subject: ${event.subject}`,
    `created_at: ${event.created_at}`,
    `occurred_at: ${event.occurred_at}`,
    `claim_id: ${event.claim_id}`,
    '',
    event.body,
    '--- END EVENT ---',
    '',
  ].join('\n');
}

function formatIdentity(agent: CollaborationAgentId): string {
  return `${agent.agent_name} / ${agent.platform} / ${agent.session_id_prefix}`;
}

function formatNarrativeAddressee(event: NarrativeCommsEvent): string {
  if (event.addressed_to !== undefined) {
    return formatIdentity(event.addressed_to);
  }
  return event.audience === undefined
    ? 'BROADCAST'
    : `GROUP(${event.audience.map(formatIdentity).join(', ')})`;
}
