import { sameAgentRoutingKey } from './active-agent-routing.js';
import { formatClassifiedEvent } from './comms-event-format.js';
import { isCanonicalTag, type CommsEventTag } from './comms-tag-namespace.js';
import {
  type CollaborationAgentId,
  type CommsEvent,
  type DirectedCommsMessage,
  type DrainResult,
  type NarrativeCommsEvent,
} from './types.js';

export { type EventView } from './comms-event-views.js';
import { type EventView } from './comms-event-views.js';

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
 * self-exclusion plus, when `excludeTags` is supplied, the sanctioned
 * F-146 tag-exclusion mechanism — hand-rolled filtering at the watcher
 * boundary remains forbidden; see `classifyEventForAgent` for the
 * visibility contract. Output lines are tagged `[BROADCAST]` / `[GROUP]` /
 * `[DIRECTED]` / `[OBSERVED]` / `[LIFECYCLE]` so the agent knows the channel
 * at a glance.
 *
 * Tag exclusion is deliberately narrow: an event is excluded only when it
 * is NOT addressed to the agent (`directed` and `group` views always
 * surface, whatever their tags), it carries at least one tag, and EVERY
 * tag it carries is excluded — a multi-tag event with any non-excluded tag
 * (e.g. a failure-mode capture that also carries `heartbeat`) leaks
 * through. Exclusion applies before any `remainingEvents` slice, so
 * excluded events never consume the emission budget; their ids return in
 * `excludedEventIds` (all of them, beyond any slice horizon) for
 * unconditional seen-marking — see `DrainResult`.
 *
 * Returns the formatted output and the IDs of drained events; does NOT mark
 * them seen. The caller marks events owed emission AFTER the emit step
 * succeeds so a crash between drain and emit produces duplicate (safe)
 * rather than missed (unsafe) notifications, and marks `excludedEventIds`
 * unconditionally after a successful drain (they carry no emission debt).
 * See FM-2 cure (2026-05-23).
 */
export async function drainRelevantEvents(input: {
  readonly messages: readonly CommsEvent[];
  readonly seenIds: ReadonlySet<string>;
  readonly self: CollaborationAgentId;
  readonly remainingEvents?: number;
  readonly excludeTags?: ReadonlySet<CommsEventTag>;
}): Promise<DrainResult> {
  const unseen = input.messages
    .map((event) => ({ event, view: classifyEventForAgent({ event, self: input.self }) }))
    .filter(
      (entry): entry is { readonly event: CommsEvent; readonly view: EventView } =>
        entry.view !== undefined,
    )
    .filter((entry) => !input.seenIds.has(entry.event.event_id))
    .toSorted((left, right) => compareCommsEvents(left.event, right.event));

  const excludedEventIds = unseen
    .filter((entry) => isExcludedByTags(entry, input.excludeTags))
    .map((entry) => entry.event.event_id);
  const classified = unseen
    .filter((entry) => !isExcludedByTags(entry, input.excludeTags))
    .slice(0, input.remainingEvents);

  if (classified.length === 0) {
    return { output: '', eventCount: 0, eventIds: [], excludedEventIds };
  }

  const eventIds = classified.map((entry) => entry.event.event_id);

  return {
    output: classified.map(formatClassifiedEvent).join('\n'),
    eventCount: classified.length,
    eventIds,
    excludedEventIds,
  };
}

/**
 * The F-146 exclusion predicate. Addressed views (`directed`, `group`)
 * always surface; an unaddressed event is excluded only when it carries at
 * least one tag and every tag it carries is in `excludeTags`.
 */
function isExcludedByTags(
  entry: { readonly event: CommsEvent; readonly view: EventView },
  excludeTags: ReadonlySet<CommsEventTag> | undefined,
): boolean {
  if (excludeTags === undefined || excludeTags.size === 0) {
    return false;
  }
  if (entry.view === 'directed' || entry.view === 'group') {
    return false;
  }
  const tags = entry.event.tags;
  if (tags === undefined || tags.length === 0) {
    return false;
  }
  // Stored event tags arrive as strings; the guard narrows each onto the
  // closed namespace before membership (zero-widening — the set never
  // becomes a string view).
  return tags.every((tag) => isCanonicalTag(tag) && excludeTags.has(tag));
}

function isSelfAuthored(event: CommsEvent, self: CollaborationAgentId): boolean {
  // PDR-076a id-aware self-exclusion. Routes via sameAgentRoutingKey so the
  // id-keyed branch disambiguates the (same-name + same-prefix + different-id)
  // collision case the plan was authored to cure; legacy/legacy pairs fall
  // back to (name, prefix) equality unchanged.
  return sameAgentRoutingKey(authorOf(event), self);
}

function authorOf(event: CommsEvent): CollaborationAgentId {
  return event.kind === 'directed' ? event.from : event.author;
}

function classifyDirected(event: DirectedCommsMessage, self: CollaborationAgentId): EventView {
  return sameAgentRoutingKey(event.to, self) ? 'directed' : 'observed';
}

function classifyNarrative(event: NarrativeCommsEvent, self: CollaborationAgentId): EventView {
  if (event.addressed_to !== undefined) {
    return sameAgentRoutingKey(event.addressed_to, self) ? 'directed' : 'observed';
  }
  if (event.audience !== undefined) {
    return event.audience.some((a) => sameAgentRoutingKey(a, self)) ? 'group' : 'observed';
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
