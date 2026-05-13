import { describe, expect, it } from 'vitest';

import {
  buildCollaborationTuiSnapshot,
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from '../../src/collaboration-state';

const nowIso = '2026-05-12T14:00:00Z';

const codexAgent: CollaborationAgentId = {
  agent_name: 'Shadowed Dimming Veil',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e1c',
};

const cursorAgent: CollaborationAgentId = {
  agent_name: 'Moonlit Transiting Prism',
  platform: 'cursor',
  model: 'GPT-5.5',
  session_id_prefix: 'e86710',
};

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
        from: 'Shadowed Dimming Veil / codex / GPT-5 / 019e1c',
        to: 'Moonlit Transiting Prism / cursor / GPT-5.5 / e86710',
      },
    ]);
    expect(snapshot.agents).toMatchObject([
      {
        routing_key: 'Moonlit Transiting Prism / cursor / e86710',
        visibility_status: 'active',
        queue_count: 1,
      },
      {
        routing_key: 'Shadowed Dimming Veil / codex / 019e1c',
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
