import { type ActiveAgentReport } from '../active-agents.js';
import { type CommsEvent, type DirectedCommsMessage, type LifecycleCommsEvent } from '../types.js';
import { type TuiDirectedEntry, type TuiQueueEntry } from './snapshot.js';

export interface TuiOperatorValueSummary {
  readonly recent_changes: readonly TuiRecentChangeEntry[];
  readonly ownership: TuiOwnershipSummary;
  readonly queue_pressure: TuiQueuePressureSummary;
  readonly directed_thread_pressure: TuiDirectedThreadPressureSummary;
  readonly needs_attention: readonly TuiNeedsAttentionEntry[];
}

interface TuiRecentChangeEntry {
  readonly id: string;
  readonly created_at: string;
  readonly kind: 'narrative' | `lifecycle:${string}` | `directed:${string}`;
  readonly summary: string;
}

interface TuiOwnershipSummary {
  readonly active: number;
  readonly stale: number;
  readonly inactive: number;
  readonly uncertain: number;
  readonly collisions: number;
}

interface TuiQueuePressureSummary {
  readonly active: number;
  readonly expired: number;
  readonly total: number;
  readonly status: 'clear' | 'active' | 'attention';
}

interface TuiDirectedThreadPressureSummary {
  readonly total: number;
  readonly needs_attention: number;
}

interface TuiNeedsAttentionEntry {
  readonly severity: 'high' | 'medium';
  readonly summary: string;
}

export function operatorValue(
  events: readonly CommsEvent[],
  reports: readonly ActiveAgentReport[],
  queue: readonly TuiQueueEntry[],
  directed: readonly TuiDirectedEntry[],
): TuiOperatorValueSummary {
  const ownership = ownershipSummary(reports);
  const queuePressure = queuePressureSummary(queue);
  const directedThreadPressure = directedThreadPressureSummary(directed);

  return {
    recent_changes: recentChanges(events),
    ownership,
    queue_pressure: queuePressure,
    directed_thread_pressure: directedThreadPressure,
    needs_attention: needsAttention(ownership, queuePressure, directedThreadPressure),
  };
}

function recentChanges(events: readonly CommsEvent[]): readonly TuiRecentChangeEntry[] {
  return events
    .map((event) => ({
      id: event.event_id,
      created_at: event.created_at,
      kind: eventKind(event),
      summary: eventSummary(event),
    }))
    .toSorted(compareNewestFirst)
    .slice(0, 5);
}

function eventKind(event: CommsEvent): TuiRecentChangeEntry['kind'] {
  if (isLifecycleEvent(event)) {
    return `lifecycle:${event.event_type}`;
  }
  if (isDirectedMessage(event)) {
    return `directed:${event.message_kind}`;
  }
  return 'narrative';
}

function eventSummary(event: CommsEvent): string {
  if (isDirectedMessage(event)) {
    return event.subject;
  }
  return event.title;
}

function isLifecycleEvent(event: CommsEvent): event is LifecycleCommsEvent {
  return event.kind === 'lifecycle';
}

function isDirectedMessage(event: CommsEvent): event is DirectedCommsMessage {
  return event.kind === 'directed';
}

function ownershipSummary(reports: readonly ActiveAgentReport[]): TuiOwnershipSummary {
  return {
    active: reports.filter((report) => report.visibility_status === 'active').length,
    stale: reports.filter((report) => report.visibility_status === 'stale').length,
    inactive: reports.filter((report) => report.visibility_status === 'inactive').length,
    uncertain: reports.filter((report) => report.visibility_status === 'uncertain').length,
    collisions: reports.filter((report) => report.collision_status === 'collision').length,
  };
}

function queuePressureSummary(queue: readonly TuiQueueEntry[]): TuiQueuePressureSummary {
  const active = queue.filter((entry) => entry.status === 'active').length;
  const expired = queue.filter((entry) => entry.status === 'expired').length;
  const total = active + expired;
  return {
    active,
    expired,
    total,
    status: expired > 0 ? 'attention' : active > 0 ? 'active' : 'clear',
  };
}

function directedThreadPressureSummary(
  directed: readonly TuiDirectedEntry[],
): TuiDirectedThreadPressureSummary {
  return {
    total: directed.length,
    needs_attention: directed.length,
  };
}

function needsAttention(
  ownership: TuiOwnershipSummary,
  queuePressure: TuiQueuePressureSummary,
  directedThreadPressure: TuiDirectedThreadPressureSummary,
): readonly TuiNeedsAttentionEntry[] {
  return [
    ...attentionWhen(ownership.collisions, 'high', {
      singular: 'identity routing collision needs coordinator attention',
      plural: 'identity routing collisions need coordinator attention',
    }),
    ...attentionWhen(directedThreadPressure.needs_attention, 'high', {
      singular: 'directed thread needs acknowledgement or routing',
      plural: 'directed threads need acknowledgement or routing',
    }),
    ...attentionWhen(queuePressure.expired, 'medium', {
      singular: 'commit queue entry is expired',
      plural: 'commit queue entries are expired',
    }),
    ...attentionWhen(ownership.stale, 'medium', {
      singular: 'agent route is stale',
      plural: 'agent routes are stale',
    }),
  ];
}

function attentionWhen(
  count: number,
  severity: TuiNeedsAttentionEntry['severity'],
  words: { readonly singular: string; readonly plural: string },
): readonly TuiNeedsAttentionEntry[] {
  if (count === 0) {
    return [];
  }

  return [
    {
      severity,
      summary: `${count} ${count === 1 ? words.singular : words.plural}.`,
    },
  ];
}

function compareNewestFirst(
  left: { readonly created_at: string; readonly id: string },
  right: { readonly created_at: string; readonly id: string },
): number {
  const byTime = Date.parse(right.created_at) - Date.parse(left.created_at);
  return byTime === 0 ? right.id.localeCompare(left.id) : byTime;
}
