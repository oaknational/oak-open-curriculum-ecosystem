import { describe, expect, it } from 'vitest';

import {
  buildCollaborationTuiSnapshot,
  type ClosedClaimsArchive,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from '../../src/collaboration-state';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity';

const nowIso = '2026-05-12T14:00:00Z';

const codexAgent = deriveOverrideCollaborationIdentity({
  agent_name: 'Shadowed Dimming Veil',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e1c',
});

const cursorAgent = deriveOverrideCollaborationIdentity({
  agent_name: 'Moonlit Transiting Prism',
  platform: 'cursor',
  model: 'GPT-5.5',
  session_id_prefix: 'e86710',
});

describe('buildCollaborationTuiSnapshot', () => {
  it('projects collaboration state into stable panes for the TUI', () => {
    const registry: CollaborationRegistry = {
      schema_version: '1.3.0',
      claims: [
        claim({
          claim_id: 'codex-claim',
          intent: 'Implement collaboration TUI primitives.',
        }),
      ],
      commit_queue: [
        queueEntry({
          intent_id: 'expired-intent',
          expires_at: '2026-05-12T13:50:00Z',
        }),
        queueEntry({
          intent_id: 'active-intent',
          agent_id: cursorAgent,
          commit_subject: 'docs(agent): hand off graph plan',
          expires_at: '2026-05-12T14:20:00Z',
        }),
      ],
    };
    const closedArchive: ClosedClaimsArchive = {
      schema_version: '1.3.0',
      claims: [claim({ claim_id: 'closed-codex-claim' })],
    };

    const snapshot = buildCollaborationTuiSnapshot({
      registry,
      closedArchive,
      events: [
        narrative({
          event_id: 'older',
          created_at: '2026-05-12T12:00:00Z',
          title: 'Older note',
        }),
        lifecycle({
          event_id: 'newer',
          created_at: '2026-05-12T13:00:00Z',
          event_type: 'session_handoff',
          title: 'Handoff landed',
        }),
        directed({
          event_id: 'directed-1',
          created_at: '2026-05-12T13:30:00Z',
          subject: 'Please avoid index',
        }),
      ],
      nowIso,
    });

    expect(snapshot.generated_at).toBe(nowIso);
    expect(snapshot.main).toMatchObject([
      { id: 'newer', kind: 'lifecycle', title: '[session_handoff] Handoff landed' },
      { id: 'older', kind: 'narrative', title: 'Older note' },
    ]);
    expect(snapshot.directed).toMatchObject([
      {
        id: 'directed-1',
        from: `Shadowed Dimming Veil / codex / GPT-5 / 019e1c / id:${codexAgent.id}`,
        to: `Moonlit Transiting Prism / cursor / GPT-5.5 / e86710 / id:${cursorAgent.id}`,
      },
    ]);
    // PDR-076a §Decision item 2: the routing key is `(agent_name, id)` —
    // `platform`, `model`, and `session_id_prefix` are not routing weights.
    expect(snapshot.agents).toMatchObject([
      {
        routing_key: `Moonlit Transiting Prism / id:${cursorAgent.id}`,
        visibility_status: 'active',
        queue_count: 1,
      },
      {
        routing_key: `Shadowed Dimming Veil / id:${codexAgent.id}`,
        visibility_status: 'active',
        claim_count: 1,
        queue_count: 1,
        closed_claim_count: 1,
        latest_intent: 'Implement collaboration TUI primitives.',
      },
    ]);
    expect(snapshot.queue.map((entry) => entry.intent_id)).toEqual([
      'active-intent',
      'expired-intent',
    ]);
  });

  it('keeps closed-only inactive agents visible in the operator surface', () => {
    const closedOnlyAgent = deriveOverrideCollaborationIdentity({
      agent_name: 'Hushed Resting Signal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e1b',
    });

    const snapshot = buildCollaborationTuiSnapshot({
      registry: { schema_version: '1.3.0', claims: [], commit_queue: [] },
      closedArchive: {
        schema_version: '1.3.0',
        claims: [claim({ agent_id: closedOnlyAgent, claim_id: 'closed-only' })],
      },
      events: [],
      nowIso,
    });

    expect(snapshot.agents).toStrictEqual([
      {
        routing_key: `Hushed Resting Signal / id:${closedOnlyAgent.id}`,
        visibility_status: 'inactive',
        collision_status: 'clear',
        claim_count: 0,
        queue_count: 0,
        closed_claim_count: 1,
      },
    ]);
  });

  it('summarises live operator-value signals without reading raw state', () => {
    const staleAgent = deriveOverrideCollaborationIdentity({
      agent_name: 'Dim Pausing Signal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e1d',
    });
    const conflictingAgentA = deriveOverrideCollaborationIdentity({
      agent_name: 'Pearly Drifting Jetty',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e22',
    });
    // Same name+prefix as A → same derived id (same routing key), different
    // model → sameIdentity false but sameAgentRoutingKey true: the collision.
    const conflictingAgentB = {
      ...conflictingAgentA,
      model: 'GPT-5.1',
    };
    const closedOnlyAgent = deriveOverrideCollaborationIdentity({
      agent_name: 'Hushed Resting Signal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e1b',
    });

    const snapshot = buildCollaborationTuiSnapshot({
      registry: {
        schema_version: '1.3.0',
        claims: [
          claim({
            agent_id: conflictingAgentA,
            claim_id: 'active-claim',
            intent: 'Coordinate the P8 operator-value work.',
          }),
          claim({
            agent_id: conflictingAgentB,
            claim_id: 'colliding-claim',
            intent: 'Accidental duplicate coordinator route.',
          }),
          claim({
            agent_id: staleAgent,
            claim_id: 'stale-claim',
            claimed_at: '2026-05-12T10:00:00Z',
            freshness_seconds: 60,
          }),
        ],
        commit_queue: [
          queueEntry({
            intent_id: 'active-intent',
            agent_id: conflictingAgentA,
            expires_at: '2026-05-12T14:20:00Z',
          }),
          queueEntry({
            intent_id: 'expired-intent',
            agent_id: staleAgent,
            expires_at: '2026-05-12T13:30:00Z',
          }),
        ],
      },
      closedArchive: {
        schema_version: '1.3.0',
        claims: [claim({ agent_id: closedOnlyAgent, claim_id: 'closed-only' })],
      },
      events: [
        narrative({
          event_id: 'narrative-update',
          created_at: '2026-05-12T13:55:00Z',
          title: 'P8 operator route updated',
        }),
        directed({
          event_id: 'directed-assignment',
          created_at: '2026-05-12T13:58:00Z',
          message_kind: 'coordination-directive',
          subject: 'Take P8 Slice A',
        }),
      ],
      nowIso,
    });

    expect(snapshot.operator_value).toStrictEqual({
      recent_changes: [
        {
          id: 'directed-assignment',
          created_at: '2026-05-12T13:58:00Z',
          kind: 'directed:coordination-directive',
          summary: 'Take P8 Slice A',
        },
        {
          id: 'narrative-update',
          created_at: '2026-05-12T13:55:00Z',
          kind: 'narrative',
          summary: 'P8 operator route updated',
        },
      ],
      ownership: {
        active: 0,
        stale: 1,
        inactive: 1,
        uncertain: 1,
        collisions: 1,
      },
      queue_pressure: {
        active: 1,
        expired: 1,
        total: 2,
        status: 'attention',
      },
      directed_thread_pressure: {
        total: 1,
        needs_attention: 1,
      },
      needs_attention: [
        {
          severity: 'high',
          summary: '1 identity routing collision needs coordinator attention.',
        },
        {
          severity: 'high',
          summary: '1 directed thread needs acknowledgement or routing.',
        },
        {
          severity: 'medium',
          summary: '1 commit queue entry is expired.',
        },
        {
          severity: 'medium',
          summary: '1 agent route is stale.',
        },
      ],
    });
  });

  it('pluralises needs-attention summaries for human-readable text output', () => {
    const staleAgentA = deriveOverrideCollaborationIdentity({
      agent_name: 'Dim Pausing Signal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e1d',
    });
    const staleAgentB = deriveOverrideCollaborationIdentity({
      agent_name: 'Quiet Pausing Signal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e1e',
    });
    const conflictingAgentA = deriveOverrideCollaborationIdentity({
      agent_name: 'Pearly Drifting Jetty',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e22',
    });
    // Same name+prefix as A → same derived id (same routing key), different
    // model → sameIdentity false but sameAgentRoutingKey true: the collision.
    const conflictingAgentB = {
      ...conflictingAgentA,
      model: 'GPT-5.1',
    };
    const secondConflictingAgentA = deriveOverrideCollaborationIdentity({
      agent_name: 'Pearly Gliding Jetty',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e23',
    });
    // Same name+prefix as second-A → same derived id (same routing key),
    // different model: a second, independent routing collision.
    const secondConflictingAgentB = {
      ...secondConflictingAgentA,
      model: 'GPT-5.1',
    };

    const snapshot = buildCollaborationTuiSnapshot({
      registry: {
        schema_version: '1.3.0',
        claims: [
          claim({ agent_id: conflictingAgentA, claim_id: 'collision-a1' }),
          claim({ agent_id: conflictingAgentB, claim_id: 'collision-a2' }),
          claim({ agent_id: secondConflictingAgentA, claim_id: 'collision-b1' }),
          claim({ agent_id: secondConflictingAgentB, claim_id: 'collision-b2' }),
          claim({
            agent_id: staleAgentA,
            claim_id: 'stale-a',
            claimed_at: '2026-05-12T10:00:00Z',
            freshness_seconds: 60,
          }),
          claim({
            agent_id: staleAgentB,
            claim_id: 'stale-b',
            claimed_at: '2026-05-12T10:00:00Z',
            freshness_seconds: 60,
          }),
        ],
        commit_queue: [
          queueEntry({
            intent_id: 'expired-a',
            agent_id: staleAgentA,
            expires_at: '2026-05-12T13:30:00Z',
          }),
          queueEntry({
            intent_id: 'expired-b',
            agent_id: staleAgentB,
            expires_at: '2026-05-12T13:31:00Z',
          }),
        ],
      },
      events: [
        directed({ event_id: 'directed-a' }),
        directed({ event_id: 'directed-b', subject: 'Second directed note' }),
      ],
      nowIso,
    });

    expect(snapshot.operator_value?.needs_attention).toStrictEqual([
      {
        severity: 'high',
        summary: '2 identity routing collisions need coordinator attention.',
      },
      {
        severity: 'high',
        summary: '2 directed threads need acknowledgement or routing.',
      },
      {
        severity: 'medium',
        summary: '2 commit queue entries are expired.',
      },
      {
        severity: 'medium',
        summary: '2 agent routes are stale.',
      },
    ]);
  });
});

function claim(overrides: Partial<CollaborationClaim> = {}): CollaborationClaim {
  return {
    claim_id: 'claim-1',
    agent_id: codexAgent,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['agent-tools/src/collaboration-state/tui'] }],
    claimed_at: '2026-05-12T13:00:00Z',
    freshness_seconds: 7200,
    intent: 'Test collaboration state.',
    ...overrides,
  };
}

function queueEntry(
  overrides: Partial<CollaborationCommitQueueEntry> = {},
): CollaborationCommitQueueEntry {
  return {
    intent_id: 'queue-intent',
    claim_id: 'queue-claim',
    agent_id: codexAgent,
    files: ['agent-tools/src/collaboration-state/tui/snapshot.ts'],
    commit_subject: 'feat(agent-tools): add collaboration tui',
    queued_at: '2026-05-12T13:00:00Z',
    updated_at: '2026-05-12T13:00:00Z',
    expires_at: '2026-05-12T14:30:00Z',
    phase: 'queued',
    ...overrides,
  };
}

function narrative(overrides: Partial<NarrativeCommsEvent> = {}): NarrativeCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: 'narrative-1',
    created_at: '2026-05-12T12:00:00Z',
    kind: 'narrative',
    author: codexAgent,
    title: 'Shared note',
    body: 'Shared note body.',
    ...overrides,
  };
}

function lifecycle(overrides: Partial<LifecycleCommsEvent> = {}): LifecycleCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: 'lifecycle-1',
    kind: 'lifecycle',
    event_type: 'session_handoff',
    created_at: '2026-05-12T12:30:00Z',
    occurred_at: '2026-05-12T12:30:00Z',
    author: codexAgent,
    agent_id: codexAgent,
    thread: 'agentic-engineering-enhancements',
    claim_id: 'claim-1',
    title: 'Session handoff',
    subject: 'Session handoff',
    body: 'Lifecycle body.',
    ...overrides,
  };
}

function directed(overrides: Partial<DirectedCommsMessage> = {}): DirectedCommsMessage {
  return {
    schema_version: '2.0.0',
    event_id: 'directed-1',
    created_at: '2026-05-12T13:30:00Z',
    kind: 'directed',
    message_kind: 'note',
    from: codexAgent,
    to: cursorAgent,
    subject: 'Directed note',
    body: 'Directed note body.',
    ...overrides,
  };
}
