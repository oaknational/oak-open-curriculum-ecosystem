import {
  type CollaborationAgentId,
  type CommsEvent,
  type DirectedCommsMessage,
  type DrainResult,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from './types.js';

/**
 * Comms-event view types — every event is one of these from the perspective
 * of a given agent. The comms event stream is the canonical truth; these are
 * the views the agent sees onto it.
 *
 * - `broadcast`: narrative event with no addressing — visible to everyone.
 * - `group`: narrative event whose `audience` array includes the agent.
 * - `directed`: directed-kind message addressed to the agent, OR narrative
 *   event whose `addressed_to` names the agent.
 * - `observed`: cross-traffic the agent witnesses but is not the addressee
 *   of — directed-kind events to another agent, narratives `addressed_to`
 *   another agent, or narratives whose `audience` is set but excludes the
 *   agent. **Incidental visibility, not a change to the agent's work
 *   contract**: observed events do not impose action on the agent. They
 *   exist so the broad-awareness contract per
 *   `.agent/rules/comms-all-channels-watcher.md` holds — agents apply
 *   relevance triage in their own reasoning, not at the watcher boundary.
 * - `lifecycle`: structured lifecycle moment (session, claim, consolidation).
 *
 * Sync-urgent messages are not a separate kind today: they are carried by
 * any of the above views with an urgency convention applied at the agent's
 * reasoning layer, not at the watcher boundary. When the schema grows a
 * sync kind or urgency flag, `sync` will be added here as a sixth view.
 */
export type EventView = 'broadcast' | 'group' | 'directed' | 'observed' | 'lifecycle';

/**
 * Classify an event relative to an agent's identity, returning `undefined`
 * only when the event is self-authored.
 *
 * Visibility rules (per the all-channels-matter principle — every non-self
 * event surfaces; the agent's reasoning layer decides relevance):
 * - Self-exclusion is non-negotiable: events authored by the agent are
 *   never surfaced — emitting self-events creates a feedback loop that
 *   contaminates the agent's reasoning context. This is the ONLY path
 *   that returns `undefined`.
 * - Every directed-kind event surfaces — as `directed` when addressed to
 *   the agent, as `observed` when addressed to a different agent.
 * - Every narrative surfaces — as `broadcast` when unaddressed, `directed`
 *   when `addressed_to` names the agent, `group` when the agent is in the
 *   `audience`, or `observed` when `addressed_to` names a different agent
 *   or `audience` is set but excludes the agent.
 * - Every lifecycle event surfaces as `lifecycle`.
 */
export function classifyEventForAgent(input: {
  readonly event: CommsEvent;
  readonly self: CollaborationAgentId;
}): EventView | undefined {
  if (isSelfAuthored(input.event, input.self)) {
    return undefined;
  }
  if (input.event.kind === 'directed') {
    return classifyDirected(input.event, input.self);
  }
  if (input.event.kind === 'lifecycle') {
    return 'lifecycle';
  }
  return classifyNarrative(input.event, input.self);
}

/**
 * Drain unseen relevant events from the canonical comms stream.
 *
 * Replaces the legacy `drainDirectedInbox` as the default for `comms watch`
 * and `comms inbox`. Emits every event classified as relevant for `self`
 * (all five views: broadcast, group, directed, observed, lifecycle) with
 * self-exclusion only — see `classifyEventForAgent` for the visibility
 * contract. Output lines are tagged `[BROADCAST]` / `[GROUP]` /
 * `[DIRECTED]` / `[OBSERVED]` / `[LIFECYCLE]` so the agent knows the channel
 * at a glance.
 *
 * Returns the formatted output and the IDs of drained events; does NOT mark
 * them seen. The caller is responsible for marking AFTER the emit step
 * succeeds so a crash between drain and emit produces duplicate (safe)
 * rather than missed (unsafe) notifications. See FM-2 cure (2026-05-23).
 */
export async function drainRelevantEvents(input: {
  readonly messages: readonly CommsEvent[];
  readonly seenIds: ReadonlySet<string>;
  readonly self: CollaborationAgentId;
  readonly remainingEvents?: number;
}): Promise<DrainResult> {
  const classified = input.messages
    .map((event) => ({ event, view: classifyEventForAgent({ event, self: input.self }) }))
    .filter(
      (entry): entry is { readonly event: CommsEvent; readonly view: EventView } =>
        entry.view !== undefined,
    )
    .filter((entry) => !input.seenIds.has(entry.event.event_id))
    .toSorted((left, right) => compareCommsEvents(left.event, right.event))
    .slice(0, input.remainingEvents);

  if (classified.length === 0) {
    return { output: '', eventCount: 0, eventIds: [] };
  }

  const eventIds = classified.map((entry) => entry.event.event_id);

  return {
    output: classified.map(formatClassifiedEvent).join('\n'),
    eventCount: classified.length,
    eventIds,
  };
}

function isSelfAuthored(event: CommsEvent, self: CollaborationAgentId): boolean {
  const author = authorOf(event);
  return (
    author.agent_name === self.agent_name && author.session_id_prefix === self.session_id_prefix
  );
}

function authorOf(event: CommsEvent): CollaborationAgentId {
  return event.kind === 'directed' ? event.from : event.author;
}

function classifyDirected(event: DirectedCommsMessage, self: CollaborationAgentId): EventView {
  return event.to.agent_name === self.agent_name &&
    event.to.session_id_prefix === self.session_id_prefix
    ? 'directed'
    : 'observed';
}

function classifyNarrative(event: NarrativeCommsEvent, self: CollaborationAgentId): EventView {
  const prefix = self.session_id_prefix;
  if (event.addressed_to !== undefined) {
    return event.addressed_to.session_id_prefix === prefix ? 'directed' : 'observed';
  }
  if (event.audience !== undefined) {
    return event.audience.some((a) => a.session_id_prefix === prefix) ? 'group' : 'observed';
  }
  return 'broadcast';
}

function compareCommsEvents(left: CommsEvent, right: CommsEvent): number {
  const byTime = Date.parse(left.created_at) - Date.parse(right.created_at);
  if (byTime !== 0) {
    return byTime;
  }
  return left.event_id.localeCompare(right.event_id);
}

function formatClassifiedEvent(entry: {
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
