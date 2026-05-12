import { claimReport } from './claim-reports.js';
import {
  formatAgent,
  formatRoutingKey,
  routingKeyFor,
  sameAgentRoutingKey,
  sameIdentity,
  type AgentRoutingKey,
} from './active-agent-routing.js';
import {
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
} from './types.js';

export interface ActiveClaimSummary {
  readonly claim_id: string;
  readonly thread: string;
  readonly freshness_status: 'fresh' | 'stale';
  readonly fresh_until: string;
  readonly intent: string;
}

export interface ActiveCommitQueueSummary {
  readonly intent_id: string;
  readonly claim_id: string;
  readonly phase: CollaborationCommitQueueEntry['phase'];
  readonly queue_status: 'active' | 'expired' | 'abandoned';
  readonly expires_at: string;
  readonly commit_subject: string;
}

export interface ActiveAgentReport {
  readonly routing_key: AgentRoutingKey;
  readonly visibility_status: 'active' | 'stale' | 'inactive' | 'uncertain';
  readonly collision_status: 'clear' | 'collision';
  readonly identities: readonly CollaborationAgentId[];
  readonly claims: readonly ActiveClaimSummary[];
  readonly commit_queue: readonly ActiveCommitQueueSummary[];
  readonly closed_claims: readonly ClosedClaimSummary[];
}

export interface ClosedClaimSummary {
  readonly claim_id: string;
  readonly thread: string;
  readonly closure_kind: 'explicit' | 'stale' | 'owner_forced' | 'unknown';
  readonly closed_at?: string;
}

export function activeAgentReports(
  registry: CollaborationRegistry,
  nowIso: string,
  closedArchive?: ClosedClaimsArchive,
): readonly ActiveAgentReport[] {
  const groups = new Map<string, MutableActiveAgentReport>();
  addClaimGroups(groups, registry, nowIso);
  addCommitQueueGroups(groups, registry, nowIso);
  addClosedClaimGroups(groups, closedArchive);
  return sortedReports(groups);
}

function addClaimGroups(
  groups: Map<string, MutableActiveAgentReport>,
  registry: CollaborationRegistry,
  nowIso: string,
): void {
  for (const claim of registry.claims) {
    const report = claimReport(claim, nowIso);
    const group = reportGroup(groups, claim.agent_id);
    addIdentity(group, claim.agent_id);
    group.claims.push({
      claim_id: claim.claim_id,
      thread: claim.thread,
      freshness_status: report.freshness_status,
      fresh_until: report.fresh_until,
      intent: claim.intent,
    });
  }
}

function addCommitQueueGroups(
  groups: Map<string, MutableActiveAgentReport>,
  registry: CollaborationRegistry,
  nowIso: string,
): void {
  for (const entry of registry.commit_queue) {
    const queueStatus = queueStatusFor(entry, nowIso);
    if (queueStatus === 'abandoned') {
      continue;
    }
    const group = reportGroup(groups, entry.agent_id);
    addIdentity(group, entry.agent_id);
    group.commit_queue.push({
      intent_id: entry.intent_id,
      claim_id: entry.claim_id,
      phase: entry.phase,
      queue_status: queueStatus,
      expires_at: entry.expires_at,
      commit_subject: entry.commit_subject,
    });
  }
}

function addClosedClaimGroups(
  groups: Map<string, MutableActiveAgentReport>,
  closedArchive: ClosedClaimsArchive | undefined,
): void {
  for (const claim of closedArchive?.claims ?? []) {
    const group = reportGroup(groups, claim.agent_id);
    addIdentity(group, claim.agent_id);
    group.closed_claims.push({
      claim_id: claim.claim_id,
      thread: claim.thread,
      closure_kind: claim.closure?.kind ?? 'unknown',
      ...(claim.closure?.closed_at === undefined ? {} : { closed_at: claim.closure.closed_at }),
    });
  }
}

function sortedReports(
  groups: Map<string, MutableActiveAgentReport>,
): readonly ActiveAgentReport[] {
  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      collision_status: collisionStatus(group),
      visibility_status: visibilityStatus(group),
      claims: group.claims.toSorted((left, right) => left.claim_id.localeCompare(right.claim_id)),
      commit_queue: group.commit_queue.toSorted((left, right) =>
        left.intent_id.localeCompare(right.intent_id),
      ),
      closed_claims: group.closed_claims.toSorted((left, right) =>
        left.claim_id.localeCompare(right.claim_id),
      ),
    }))
    .toSorted((left, right) =>
      formatRoutingKey(left.routing_key).localeCompare(formatRoutingKey(right.routing_key)),
    );
}

function collisionStatus(group: MutableActiveAgentReport): 'clear' | 'collision' {
  return group.identities.length > 1 ? 'collision' : 'clear';
}

function visibilityStatus(
  group: MutableActiveAgentReport,
): 'active' | 'stale' | 'inactive' | 'uncertain' {
  if (collisionStatus(group) === 'collision') {
    return 'uncertain';
  }
  if (
    group.claims.some((claim) => claim.freshness_status === 'fresh') ||
    group.commit_queue.some((entry) => entry.queue_status === 'active')
  ) {
    return 'active';
  }
  if (
    group.claims.some((claim) => claim.freshness_status === 'stale') ||
    group.commit_queue.some((entry) => entry.queue_status === 'expired')
  ) {
    return 'stale';
  }
  return 'inactive';
}

export function assertNoLiveIdentityRoutingCollision(input: {
  readonly registry: CollaborationRegistry;
  readonly nowIso: string;
  readonly agentId: CollaborationAgentId;
  readonly surface: string;
}): void {
  for (const identity of liveAgentIdentities(input.registry, input.nowIso)) {
    if (!sameAgentRoutingKey(identity, input.agentId)) {
      continue;
    }
    if (!sameIdentity(identity, input.agentId)) {
      throw new Error(
        `${input.surface} identity route ${formatRoutingKey(routingKeyFor(input.agentId))} ` +
          `collides with live identity ${formatAgent(identity)}`,
      );
    }
  }
}

function reportGroup(
  groups: Map<string, MutableActiveAgentReport>,
  agentId: CollaborationAgentId,
): MutableActiveAgentReport {
  const routingKey = routingKeyFor(agentId);
  const key = formatRoutingKey(routingKey);
  const existing = groups.get(key);
  if (existing !== undefined) {
    return existing;
  }

  const next: MutableActiveAgentReport = {
    routing_key: routingKey,
    identities: [],
    claims: [],
    commit_queue: [],
    closed_claims: [],
  };
  groups.set(key, next);
  return next;
}

function addIdentity(group: MutableActiveAgentReport, agentId: CollaborationAgentId): void {
  if (group.identities.some((identity) => sameIdentity(identity, agentId))) {
    return;
  }

  group.identities.push(agentId);
}

function queueStatusFor(
  entry: CollaborationCommitQueueEntry,
  nowIso: string,
): 'active' | 'expired' | 'abandoned' {
  if (entry.phase === 'abandoned') {
    return 'abandoned';
  }
  return Date.parse(entry.expires_at) < Date.parse(nowIso) ? 'expired' : 'active';
}

function liveAgentIdentities(
  registry: CollaborationRegistry,
  nowIso: string,
): readonly CollaborationAgentId[] {
  return [
    ...registry.claims
      .filter((claim) => claimReport(claim, nowIso).freshness_status === 'fresh')
      .map((claim) => claim.agent_id),
    ...registry.commit_queue
      .filter((entry) => queueStatusFor(entry, nowIso) === 'active')
      .map((entry) => entry.agent_id),
  ];
}

interface MutableActiveAgentReport {
  readonly routing_key: AgentRoutingKey;
  readonly identities: CollaborationAgentId[];
  readonly claims: ActiveClaimSummary[];
  readonly commit_queue: ActiveCommitQueueSummary[];
  readonly closed_claims: ClosedClaimSummary[];
}
