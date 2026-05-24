import { describe, expect, it } from 'vitest';

import {
  formatCollaborationTuiText,
  type CollaborationTuiSnapshot,
} from '../../src/collaboration-state';

describe('formatCollaborationTuiText', () => {
  it('renders a deterministic plain-text fallback for tests and non-interactive use', () => {
    const snapshot: CollaborationTuiSnapshot = {
      generated_at: '2026-05-12T14:00:00Z',
      main: [
        {
          id: 'main-1',
          created_at: '2026-05-12T13:00:00Z',
          kind: 'narrative',
          title: 'P8 started',
          author: 'Shadowed Dimming Veil / codex / GPT-5 / 019e1c',
          body: 'Implementation started with Ink primitives.',
        },
      ],
      directed: [],
      agents: [
        {
          routing_key: 'Shadowed Dimming Veil / codex / 019e1c',
          visibility_status: 'active',
          collision_status: 'clear',
          claim_count: 1,
          queue_count: 0,
          closed_claim_count: 0,
          latest_intent: 'Implement collaboration TUI primitives.',
        },
      ],
      queue: [],
      operator_value: {
        recent_changes: [
          {
            id: 'directed-1',
            created_at: '2026-05-12T13:30:00Z',
            kind: 'directed:coordination-directive',
            summary: 'Take P8 Slice A',
          },
        ],
        ownership: {
          active: 1,
          stale: 1,
          inactive: 0,
          uncertain: 0,
          collisions: 0,
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
            summary: '1 directed thread needs acknowledgement or routing.',
          },
        ],
      },
    };

    expect(formatCollaborationTuiText(snapshot)).toMatchInlineSnapshot(`
      "Collaboration TUI Snapshot
      Generated: 2026-05-12T14:00:00Z
      
      Operator value
        Ownership active=1 stale=1 inactive=0 uncertain=0 collisions=0
        Queue pressure attention active=1 expired=1 total=2
        Directed pressure needs_attention=1 total=1
        Recent changes
          2026-05-12T13:30:00Z [directed:coordination-directive] Take P8 Slice A
        Needs attention
          [high] 1 directed thread needs acknowledgement or routing.

      Main comms
        2026-05-12T13:00:00Z [narrative] P8 started
          Shadowed Dimming Veil / codex / GPT-5 / 019e1c
          Implementation started with Ink primitives.
      
      Directed messages
        (none)
      
      Active agents
        Shadowed Dimming Veil / codex / 019e1c [active/clear] claims=1 queue=0 closed=0
          Implement collaboration TUI primitives.
      
      Commit queue
        (none)
      "
    `);
  });
});
