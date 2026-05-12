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
    };

    expect(formatCollaborationTuiText(snapshot)).toMatchInlineSnapshot(`
      "Collaboration TUI Snapshot
      Generated: 2026-05-12T14:00:00Z
      
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
