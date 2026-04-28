import { isExpired } from './timestamps.js';
import {
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationRegistry,
} from './types.js';

const DEFAULT_CLAIM_TTL_SECONDS = 14400;

/**
 * Move stale claims from the active registry to the closed archive.
 */
export function archiveStaleClaims(input: {
  readonly active: CollaborationRegistry;
  readonly closed: ClosedClaimsArchive;
  readonly nowIso: string;
  readonly closedBy: CollaborationAgentId;
}): {
  readonly active: CollaborationRegistry;
  readonly closed: ClosedClaimsArchive;
} {
  const retained: CollaborationClaim[] = [];
  const archived: CollaborationClaim[] = [];

  for (const activeClaim of input.active.claims) {
    if (isClaimStale(activeClaim, input.nowIso)) {
      archived.push(closeStaleClaim(activeClaim, input));
    } else {
      retained.push(activeClaim);
    }
  }

  return {
    active: {
      ...input.active,
      claims: retained,
    },
    closed: {
      ...input.closed,
      claims: [...input.closed.claims, ...archived],
    },
  };
}

function isClaimStale(claim: CollaborationClaim, nowIso: string): boolean {
  return isExpired({
    startedAtIso: claim.heartbeat_at ?? claim.claimed_at,
    freshnessSeconds: claim.freshness_seconds ?? DEFAULT_CLAIM_TTL_SECONDS,
    nowIso,
  });
}

function closeStaleClaim(
  claim: CollaborationClaim,
  input: {
    readonly nowIso: string;
    readonly closedBy: CollaborationAgentId;
  },
): CollaborationClaim {
  return {
    ...claim,
    archived_at: input.nowIso.slice(0, 10),
    closure: {
      kind: 'stale',
      closed_at: input.nowIso,
      closed_by: input.closedBy,
      summary: 'Archived stale/orphaned claim after its freshness TTL expired.',
      evidence: [
        {
          kind: 'claim',
          ref: claim.claim_id,
          summary: 'Claim exceeded its type-specific freshness TTL.',
        },
      ],
    },
  };
}
