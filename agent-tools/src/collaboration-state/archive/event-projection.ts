/**
 * Pure projection from a parsed {@link CommsEvent} to the
 * {@link ClassifiableEvent} fields the archive-move classifier needs.
 *
 * @remarks
 * Kept separate from both the `node:fs` boundary (`archive-move-node.ts`) and the
 * classification core (`event-classification.ts`): the boundary stays thin
 * untestable glue, the core stays decoupled from the comms wire shape, and this
 * mapping — the one place that knows directed events carry `subject` where
 * narrative / lifecycle events carry `title` — is unit-testable with no IO.
 *
 * @packageDocumentation
 */

import type { CommsEvent } from '../types.js';
import type { ClassifiableEvent } from './event-classification.js';

/** Title for narrative/lifecycle events; subject for directed messages. */
function titleOrSubject(event: CommsEvent): string {
  return event.kind === 'directed' ? event.subject : event.title;
}

/** Project a parsed comms event to its classification-relevant fields. */
export function toClassifiableEvent(event: CommsEvent): ClassifiableEvent {
  return {
    eventId: event.event_id,
    kind: event.kind,
    createdAt: event.created_at,
    tags: event.tags ?? [],
    titleOrSubject: titleOrSubject(event),
    bodyLength: event.body.length,
  };
}
