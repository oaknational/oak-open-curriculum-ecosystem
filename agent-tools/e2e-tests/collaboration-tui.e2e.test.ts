import { describe, expect, it } from 'vitest';

import {
  runCollaborationStateCli,
  type ClosedClaimsArchive,
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
  type NarrativeCommsEvent,
} from '../src/collaboration-state';
import { createFakeCollaborationRuntime } from '../tests/collaboration-state/fake-collaboration-runtime';

const repoRoot = '/workspace';
const defaultCommsDir = `${repoRoot}/.agent/state/collaboration/comms`;

const activeAgent: CollaborationAgentId = {
  agent_name: 'Mossy Blossoming Canopy',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e22',
};

const inactiveAgent: CollaborationAgentId = {
  agent_name: 'Luminous Quiet Harbor',
  platform: 'claude',
  model: 'Sonnet',
  session_id_prefix: '019e20',
};

describe('collaboration TUI E2E', () => {
  it('presents live collaboration value signals from the public CLI surface', async () => {
    const fake = createFakeCollaborationRuntime({
      activeClaims: activeRegistry(),
      closedClaims: closedArchive(),
      comms: {
        [defaultCommsDir]: [
          {
            schema_version: '2.0.0',
            event_id: 'event-p8-live',
            created_at: '2026-05-13T17:47:10Z',
            kind: 'narrative',
            author: activeAgent,
            title: 'P8 live collaboration TUI is observable',
            body: 'Human observers can see the current collaboration shape without reading JSON.',
          } satisfies NarrativeCommsEvent,
        ],
      },
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'tui',
        '--format',
        'text',
        '--repo-root',
        repoRoot,
        '--now',
        '2026-05-13T17:50:00Z',
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    expect(result.stdout).toContain('Collaboration TUI Snapshot');
    expect(result.stdout).toContain('P8 live collaboration TUI is observable');
    expect(result.stdout).toContain('Mossy Blossoming Canopy / codex / 019e22 [active/clear]');
    expect(result.stdout).toContain('Luminous Quiet Harbor / claude / 019e20 [inactive/clear]');
    expect(result.stdout).toContain('p8-live-tui [active/queued] feat(agent-tools): add live TUI');
  });
});

function activeRegistry(): CollaborationRegistry {
  const claim: CollaborationClaim = {
    claim_id: 'claim-p8',
    agent_id: activeAgent,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['agent-tools/src/collaboration-state/tui/**'] }],
    claimed_at: '2026-05-13T17:47:15Z',
    freshness_seconds: 14400,
    intent: 'Implement mandatory P8 live collaboration TUI slice.',
  };
  const queueEntry: CollaborationCommitQueueEntry = {
    intent_id: 'p8-live-tui',
    claim_id: claim.claim_id,
    agent_id: activeAgent,
    files: ['agent-tools/src/collaboration-state/tui/app.tsx'],
    commit_subject: 'feat(agent-tools): add live TUI',
    queued_at: '2026-05-13T17:48:00Z',
    updated_at: '2026-05-13T17:48:00Z',
    expires_at: '2026-05-13T18:48:00Z',
    phase: 'queued',
  };

  return {
    schema_version: '1.3.0',
    claims: [claim],
    commit_queue: [queueEntry],
  };
}

function closedArchive(): ClosedClaimsArchive {
  return {
    schema_version: '1.3.0',
    claims: [
      {
        claim_id: 'closed-p5',
        agent_id: inactiveAgent,
        thread: 'agentic-engineering-enhancements',
        areas: [{ kind: 'files', patterns: ['agent-tools/src/collaboration-state/comms/**'] }],
        claimed_at: '2026-05-12T16:00:00Z',
        freshness_seconds: 14400,
        intent: 'Close P5 unified comms.',
        closure: {
          kind: 'explicit',
          closed_at: '2026-05-12T17:00:00Z',
          closed_by: inactiveAgent,
          summary: 'P5 complete.',
          evidence: [],
        },
      },
    ],
  };
}
