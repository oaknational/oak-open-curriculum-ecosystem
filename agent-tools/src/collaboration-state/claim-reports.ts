import { sameAgentRoutingKey } from './active-agent-routing.js';
import {
  type CollaborationAgentId,
  type CollaborationArea,
  type CollaborationClaim,
} from './types.js';

interface ClaimReport {
  readonly claim_id: string;
  readonly agent_id: CollaborationAgentId;
  readonly thread: string;
  readonly areas: readonly CollaborationArea[];
  readonly claimed_at: string;
  readonly heartbeat_at?: string;
  readonly freshness_seconds: number;
  readonly fresh_until: string;
  readonly freshness_status: 'fresh' | 'stale';
  readonly age_seconds: number;
  readonly intent: string;
  readonly notes?: string;
}

export function claimReport(claim: CollaborationClaim, nowIso: string): ClaimReport {
  const freshnessSeconds = claim.freshness_seconds ?? 14400;
  const freshnessStart = claim.heartbeat_at ?? claim.claimed_at;
  const freshUntilMs = Date.parse(freshnessStart) + freshnessSeconds * 1000;
  const nowMs = Date.parse(nowIso);

  return {
    claim_id: claim.claim_id,
    agent_id: claim.agent_id,
    thread: claim.thread,
    areas: claim.areas,
    claimed_at: claim.claimed_at,
    ...(claim.heartbeat_at === undefined ? {} : { heartbeat_at: claim.heartbeat_at }),
    freshness_seconds: freshnessSeconds,
    fresh_until: new Date(freshUntilMs).toISOString(),
    freshness_status: nowMs <= freshUntilMs ? 'fresh' : 'stale',
    age_seconds: Math.max(0, Math.floor((nowMs - Date.parse(freshnessStart)) / 1000)),
    intent: claim.intent,
    ...(claim.notes === undefined ? {} : { notes: claim.notes }),
  };
}

export function sameAgent(left: CollaborationAgentId, right: CollaborationAgentId): boolean {
  // PDR-076a id-aware claim ownership comparison. Cure for the same-name +
  // same-prefix + different-id collision; legacy/legacy pairs still match
  // by (name, prefix) via the discriminated-union fallback in sameAgentRoutingKey.
  return sameAgentRoutingKey(left, right);
}
