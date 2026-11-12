/**
 * Which comms events wake a Codex seat, for the seat's wake companion. The
 * companion runs beside the seat, outside any Codex sandbox, so selection
 * rests on the event's addressing and the seat's identity alone, never on an
 * event's text. See mechanism 3 of the plan node `codex-queue-wake-bridge`.
 *
 * @packageDocumentation
 */
import { isHeartbeatEvent } from './comms-heartbeat-body.js';
import { classifyEventForAgent } from './comms-relevant-events.js';
import type { CollaborationAgentId, CommsEvent } from './types.js';

/**
 * The event ids of one pass, parted by whether they wake the seat, in the
 * order they came. An id lands in exactly one part.
 */
interface WakeSelection {
  /** Events addressed to the seat: they wake it once a notice is queued. */
  readonly wake: readonly string[];
  /** Events that never wake the seat, so the companion marks them at once. */
  readonly never: readonly string[];
}

/**
 * Part a pass's events into those that wake the seat and those that never
 * will. An event wakes the seat only when the canonical classifier puts it
 * in the seat's directed or group view, which excludes the seat's own
 * events, and it is not a heartbeat. Broadcasts, observed and lifecycle
 * events never wake.
 *
 * An event id is peer-written, so two events can share one. An id that
 * wakes the seat is never also marked as not waking, so a second event
 * cannot cancel a pending wake by borrowing its id.
 *
 * @param events - The events the pass examined, none yet marked.
 * @param self - The seat's identity, derived from its thread id.
 */
export function selectWakeEvents(
  events: readonly CommsEvent[],
  self: CollaborationAgentId,
): WakeSelection {
  const waking = events.filter((event) => wakesTheSeat(event, self));
  const wake = new Set(waking.map((event) => event.event_id));
  const never = new Set(
    events.map((event) => event.event_id).filter((eventId) => !wake.has(eventId)),
  );
  return { wake: [...wake], never: [...never] };
}

function wakesTheSeat(event: CommsEvent, self: CollaborationAgentId): boolean {
  const view = classifyEventForAgent({ event, self });
  return (view === 'directed' || view === 'group') && !isHeartbeatEvent(event);
}
