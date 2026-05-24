import { activeAgentReports, type ActiveAgentReport } from '../active-agents.js';
import { formatAgent, formatRoutingKey } from '../active-agent-routing.js';
import {
  type ClosedClaimsArchive,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type CommsEvent,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from '../types.js';
import {
  type TuiAgentEntry,
  type TuiDirectedEntry,
  type TuiMainEntry,
  type TuiQueueEntry,
} from './entry-types.js';
import { operatorValue, type TuiOperatorValueSummary } from './operator-value.js';

export interface CollaborationTuiSnapshot {
  readonly generated_at: string;
  readonly main: readonly TuiMainEntry[];
  readonly directed: readonly TuiDirectedEntry[];
  readonly agents: readonly TuiAgentEntry[];
  readonly queue: readonly TuiQueueEntry[];
  readonly operator_value?: TuiOperatorValueSummary;
}

export function buildCollaborationTuiSnapshot(input: {
  readonly registry: CollaborationRegistry;
  readonly closedArchive?: ClosedClaimsArchive;
  readonly events: readonly CommsEvent[];
  readonly nowIso: string;
}): CollaborationTuiSnapshot {
  const reports = activeAgentReports(input.registry, input.nowIso, input.closedArchive);
  const queue = queueEntries(input.registry.commit_queue, input.nowIso);
  const directed = directedEntries(input.events);

  return {
    generated_at: input.nowIso,
    main: mainEntries(input.events),
    directed,
    agents: agentEntries(reports),
    queue,
    operator_value: operatorValue(input.events, reports, queue, directed),
  };
}

function mainEntries(events: readonly CommsEvent[]): readonly TuiMainEntry[] {
  return [
    ...events.filter(isNarrativeEvent).map((event) => ({
      id: event.event_id,
      created_at: event.created_at,
      kind: 'narrative' as const,
      title: event.title,
      body: event.body,
      author: formatAgent(event.author),
    })),
    ...events.filter(isLifecycleEvent).map((event) => ({
      id: event.event_id,
      created_at: event.created_at,
      kind: 'lifecycle' as const,
      title: `[${event.event_type}] ${event.title}`,
      body: event.body,
      author: formatAgent(event.author),
    })),
  ].toSorted(compareNewestFirst);
}

function directedEntries(events: readonly CommsEvent[]): readonly TuiDirectedEntry[] {
  return events
    .filter(isDirectedMessage)
    .map((message) => ({
      id: message.event_id,
      created_at: message.created_at,
      kind: message.message_kind,
      subject: message.subject,
      body: message.body,
      from: formatAgent(message.from),
      to: formatAgent(message.to),
    }))
    .toSorted(compareNewestFirst);
}

function isNarrativeEvent(event: CommsEvent): event is NarrativeCommsEvent {
  return event.kind === 'narrative';
}

function isLifecycleEvent(event: CommsEvent): event is LifecycleCommsEvent {
  return event.kind === 'lifecycle';
}

function isDirectedMessage(event: CommsEvent): event is DirectedCommsMessage {
  return event.kind === 'directed';
}

function agentEntries(reports: readonly ActiveAgentReport[]): readonly TuiAgentEntry[] {
  return reports.map((report) => ({
    routing_key: formatRoutingKey(report.routing_key),
    visibility_status: report.visibility_status,
    collision_status: report.collision_status,
    claim_count: report.claims.length,
    queue_count: report.commit_queue.length,
    closed_claim_count: report.closed_claims.length,
    ...(latestIntent(report.claims) === undefined
      ? {}
      : { latest_intent: latestIntent(report.claims) }),
  }));
}

function queueEntries(
  queue: readonly CollaborationCommitQueueEntry[],
  nowIso: string,
): readonly TuiQueueEntry[] {
  return queue
    .map((entry) => ({
      intent_id: entry.intent_id,
      agent: formatAgent(entry.agent_id),
      phase: entry.phase,
      status: queueStatus(entry, nowIso),
      commit_subject: entry.commit_subject,
      expires_at: entry.expires_at,
    }))
    .filter((entry) => entry.status !== 'abandoned')
    .toSorted((left, right) => {
      const byStatus = queueStatusRank(left.status) - queueStatusRank(right.status);
      return byStatus === 0 ? left.expires_at.localeCompare(right.expires_at) : byStatus;
    });
}

function latestIntent(
  claims: readonly { readonly intent: string; readonly fresh_until: string }[],
): string | undefined {
  return claims.toSorted((left, right) => right.fresh_until.localeCompare(left.fresh_until))[0]
    ?.intent;
}

function queueStatus(
  entry: CollaborationCommitQueueEntry,
  nowIso: string,
): 'active' | 'expired' | 'abandoned' {
  if (entry.phase === 'abandoned') {
    return 'abandoned';
  }
  return Date.parse(entry.expires_at) < Date.parse(nowIso) ? 'expired' : 'active';
}

function queueStatusRank(status: TuiQueueEntry['status']): number {
  const ranks: Record<TuiQueueEntry['status'], number> = {
    active: 0,
    expired: 1,
    abandoned: 2,
  };

  return ranks[status];
}

function compareNewestFirst(
  left: { readonly created_at: string; readonly id: string },
  right: { readonly created_at: string; readonly id: string },
): number {
  const byTime = Date.parse(right.created_at) - Date.parse(left.created_at);
  return byTime === 0 ? right.id.localeCompare(left.id) : byTime;
}
