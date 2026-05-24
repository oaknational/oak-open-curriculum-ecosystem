import { describe, expect, it } from 'vitest';

import {
  activeAgentReports,
  assertNoLiveIdentityRoutingCollision,
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
} from '../../src/collaboration-state';

const nowIso = '2026-04-28T09:37:11Z';

const woodland: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

describe('activeAgentReports', () => {
  it('reports active agents by routing tuple and flags live model collisions', () => {
    const colliding: CollaborationAgentId = { ...woodland, model: 'GPT-5.1' };
    const registry: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [
        queueEntry({
          agent_id: {
            agent_name: 'Moonlit Transiting Prism',
            platform: 'cursor',
            model: 'GPT-5.5',
            session_id_prefix: 'e86710',
          },
        }),
      ],
      claims: [
        claim({ claim_id: 'fresh-claim', agent_id: woodland }),
        claim({ claim_id: 'collision-claim', agent_id: colliding }),
        claim({
          claim_id: 'stale-claim',
          agent_id: { ...woodland, session_id_prefix: 'stale1' },
          claimed_at: '2026-04-28T08:00:00Z',
          freshness_seconds: 60,
        }),
      ],
    };

    expect(activeAgentReports(registry, nowIso)).toMatchObject([
      {
        routing_key: {
          agent_name: 'Moonlit Transiting Prism',
          platform: 'cursor',
          session_id_prefix: 'e86710',
        },
        collision_status: 'clear',
        visibility_status: 'active',
        commit_queue: [{ intent_id: 'queued-intent', queue_status: 'active' }],
      },
      {
        routing_key: {
          agent_name: 'Woodland Creeping Petal',
          platform: 'codex',
          session_id_prefix: '019dd3',
        },
        collision_status: 'collision',
        visibility_status: 'uncertain',
        identities: [woodland, colliding],
        claims: [
          { claim_id: 'collision-claim', freshness_status: 'fresh' },
          { claim_id: 'fresh-claim', freshness_status: 'fresh' },
        ],
      },
      {
        routing_key: {
          agent_name: 'Woodland Creeping Petal',
          platform: 'codex',
          session_id_prefix: 'stale1',
        },
        collision_status: 'clear',
        visibility_status: 'stale',
        claims: [{ claim_id: 'stale-claim', freshness_status: 'stale' }],
      },
    ]);
  });

  it('can include inactive agents from the closed claims archive', () => {
    const registry: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [],
    };
    const closedArchive: ClosedClaimsArchive = {
      schema_version: '1.3.0',
      claims: [
        claim({
          claim_id: 'closed-claim',
          closure: {
            kind: 'explicit',
            closed_at: '2026-04-28T09:00:00Z',
            closed_by: woodland,
            summary: 'done',
            evidence: [],
          },
        }),
      ],
    };

    expect(activeAgentReports(registry, nowIso, closedArchive)).toMatchObject([
      {
        routing_key: {
          agent_name: 'Woodland Creeping Petal',
          platform: 'codex',
          session_id_prefix: '019dd3',
        },
        collision_status: 'clear',
        visibility_status: 'inactive',
        closed_claims: [
          {
            claim_id: 'closed-claim',
            closure_kind: 'explicit',
            closed_at: '2026-04-28T09:00:00Z',
          },
        ],
      },
    ]);
  });

  it('refuses live identity routing collisions but ignores stale history', () => {
    const registry: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [
        claim({ agent_id: { ...woodland, model: 'GPT-5.1' } }),
        claim({
          claim_id: 'stale-claim',
          agent_id: { ...woodland, session_id_prefix: 'stale1', model: 'GPT-5.1' },
          claimed_at: '2026-04-28T08:00:00Z',
          freshness_seconds: 60,
        }),
      ],
    };

    expect(() =>
      assertNoLiveIdentityRoutingCollision({
        registry,
        nowIso,
        agentId: woodland,
        surface: 'claims open',
      }),
    ).toThrow(
      'claims open identity route Woodland Creeping Petal / codex / 019dd3 collides with live identity Woodland Creeping Petal / codex / GPT-5.1 / 019dd3',
    );

    expect(() =>
      assertNoLiveIdentityRoutingCollision({
        registry,
        nowIso,
        agentId: { ...woodland, session_id_prefix: 'stale1' },
        surface: 'claims open',
      }),
    ).not.toThrow();
  });
});

function claim(overrides: Partial<CollaborationClaim> = {}): CollaborationClaim {
  return {
    claim_id: '11111111-1111-4111-8111-111111111111',
    agent_id: woodland,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/shared-comms-log.md'] }],
    claimed_at: '2026-04-28T08:00:00Z',
    freshness_seconds: 14400,
    intent: 'Test collaboration-state write safety.',
    ...overrides,
  };
}

function queueEntry(
  overrides: Partial<CollaborationCommitQueueEntry> = {},
): CollaborationCommitQueueEntry {
  return {
    intent_id: 'queued-intent',
    claim_id: 'queued-claim',
    agent_id: woodland,
    files: ['agent-tools/src/collaboration-state/active-agents.ts'],
    commit_subject: 'feat(agent-tools): expose active agents',
    queued_at: '2026-04-28T09:30:00Z',
    updated_at: '2026-04-28T09:30:00Z',
    expires_at: '2026-04-28T09:52:00Z',
    phase: 'queued',
    ...overrides,
  };
}
