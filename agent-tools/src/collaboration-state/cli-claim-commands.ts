import { randomUUID } from 'node:crypto';

import { archiveStaleClaims } from './claims.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, required, valueOrDefault, type Options } from './cli-options.js';
import { updateActiveClaimsFile, updateClaimStateFiles } from './state-io.js';
import {
  type CollaborationArea,
  type CollaborationClaim,
  type CollaborationStateEnvironment,
} from './types.js';

export async function openClaim(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const identity = resolveIdentity(options, env).agent_id;
  await updateActiveClaimsFile({
    activePath: required(options, 'active'),
    transform: (registry) => ({
      ...registry,
      claims: [
        ...registry.claims,
        {
          claim_id: valueOrDefault(options, 'claim-id', randomUUID()),
          agent_id: identity,
          thread: required(options, 'thread'),
          areas: [areaFromOptions(options)],
          claimed_at: required(options, 'now'),
          freshness_seconds: Number(valueOrDefault(options, 'ttl-seconds', '14400')),
          sidebar_open: false,
          intent: required(options, 'intent'),
          ...(optional(options, 'notes') === undefined
            ? {}
            : { notes: required(options, 'notes') }),
        },
      ],
    }),
  });

  return '';
}

export async function heartbeatClaim(options: Options): Promise<string> {
  const claimId = required(options, 'claim-id');
  const now = required(options, 'now');
  await updateActiveClaimsFile({
    activePath: required(options, 'active'),
    transform: (registry) => ({
      ...registry,
      claims: registry.claims.map((claim) =>
        claim.claim_id === claimId ? { ...claim, heartbeat_at: now } : claim,
      ),
    }),
  });

  return '';
}

export async function closeClaim(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const activePath = required(options, 'active');
  const closedPath = required(options, 'closed');
  const closedBy = resolveIdentity(options, env).agent_id;
  await updateClaimStateFiles({
    activePath,
    closedPath,
    transform: ({ active, closed }) => {
      const [remaining, closing] = splitClosingClaims(
        active.claims,
        required(options, 'claim-id'),
        {
          closedAt: required(options, 'now'),
          closedBy,
          summary: required(options, 'summary'),
        },
      );

      return {
        active: { ...active, claims: remaining },
        closed: { ...closed, claims: [...closed.claims, ...closing] },
      };
    },
  });

  return '';
}

export async function archiveClaims(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const activePath = required(options, 'active');
  const closedPath = required(options, 'closed');
  await updateClaimStateFiles({
    activePath,
    closedPath,
    transform: ({ active, closed }) =>
      archiveStaleClaims({
        active,
        closed,
        nowIso: required(options, 'now'),
        closedBy: resolveIdentity(options, env).agent_id,
      }),
  });

  return '';
}

function splitClosingClaims(
  claims: readonly CollaborationClaim[],
  claimId: string,
  input: {
    readonly closedAt: string;
    readonly closedBy: CollaborationClaim['agent_id'];
    readonly summary: string;
  },
): readonly [readonly CollaborationClaim[], readonly CollaborationClaim[]] {
  const remaining: CollaborationClaim[] = [];
  const closing: CollaborationClaim[] = [];

  for (const claim of claims) {
    if (claim.claim_id === claimId) {
      closing.push(closeExplicitly(claim, input));
    } else {
      remaining.push(claim);
    }
  }

  return [remaining, closing];
}

function closeExplicitly(
  claim: CollaborationClaim,
  input: {
    readonly closedAt: string;
    readonly closedBy: CollaborationClaim['agent_id'];
    readonly summary: string;
  },
): CollaborationClaim {
  return {
    ...claim,
    archived_at: input.closedAt.slice(0, 10),
    closure: {
      kind: 'explicit',
      closed_at: input.closedAt,
      closed_by: input.closedBy,
      summary: input.summary,
      evidence: [
        {
          kind: 'claim',
          ref: claim.claim_id,
          summary: 'Claim explicitly closed by owning session.',
        },
      ],
    },
  };
}

function areaFromOptions(options: Options): CollaborationArea {
  return {
    kind: parseAreaKind(required(options, 'area-kind')),
    patterns: options.files.length > 0 ? options.files : [required(options, 'area-pattern')],
  };
}

function parseAreaKind(value: string): 'files' | 'workspace' | 'plan' | 'adr' | 'git' {
  if (
    value === 'files' ||
    value === 'workspace' ||
    value === 'plan' ||
    value === 'adr' ||
    value === 'git'
  ) {
    return value;
  }

  throw new Error(`unsupported area kind: ${value}`);
}
