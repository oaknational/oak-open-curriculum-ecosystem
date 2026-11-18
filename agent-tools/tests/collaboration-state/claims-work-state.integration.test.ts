import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { uuidV5Schema } from '../../src/collaboration-state/agent-id';
import { composeHeartbeatBody } from '../../src/collaboration-state/comms-heartbeat-body';
import { type GitWorktree } from '../../src/collaboration-state/git-worktree-list';
import {
  type CollaborationAgentId,
  type CollaborationRegistry,
  type CommsEvent,
} from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const kingfisher: CollaborationAgentId = {
  agent_name: 'Kingfisher seeks Moorings',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: '59a56d',
  id: uuidV5Schema.parse('11111111-1111-5111-9111-111111111111'),
};

const activePath = '/repo/primary/.agent/state/collaboration/active-claims.json';
const commsDir = '/repo/primary/.agent/state/collaboration/comms';
const NOW = '2026-06-28T12:00:00Z';

function heartbeat(branch: string, createdAt: string): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: `hb-${branch}`,
    created_at: createdAt,
    kind: 'narrative',
    author: kingfisher,
    title: `Heartbeat: ${kingfisher.agent_name}`,
    body: composeHeartbeatBody({
      claimId: 'c',
      intentId: 'c',
      branch,
      currentCycleLabel: 'Lane A Phase 2',
    }),
    tags: ['heartbeat'],
  };
}

const activeClaims: CollaborationRegistry = {
  schema_version: '1.4.0',
  claims: [
    {
      claim_id: '11111111-1111-4111-8111-111111111111',
      agent_id: kingfisher,
      thread: 'agent-operability',
      areas: [{ kind: 'files', patterns: ['agent-tools/src/**/spawn*/**'] }],
      claimed_at: '2026-06-28T11:55:00Z',
      freshness_seconds: 14400,
      intent: 'Lane A Phase 2 derived worktree view',
    },
  ],
};

const worktrees: readonly GitWorktree[] = [
  { path: '/repo/oak-spawn-flow', branch: 'feat/spawn-worktree-view', head: 'aaaa111' },
  { path: '/repo/primary', branch: 'coordination/team-tooling', head: 'bbbb222' },
];

describe('claims work-state — derived cross-worktree view CLI (F-98 / spawn-flow Phase 2)', () => {
  it('binds each worktree to its agent via the heartbeat branch with an input-to-verify last-seen', async () => {
    const fake = createFakeCollaborationRuntime({
      comms: { [commsDir]: [heartbeat('feat/spawn-worktree-view', '2026-06-28T11:59:00Z')] },
      worktrees,
      activeClaims,
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'claims',
        'work-state',
        '--active',
        activePath,
        '--comms-dir',
        commsDir,
        '--now',
        NOW,
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    // Rows are worktree-path-ordered: oak-spawn-flow (bound) then primary
    // (unbound — its branch has no heartbeat). The bound row exercises the full
    // join END-TO-END: git worktree ⋈ heartbeat-branch → agent + last-seen
    // recency, and the claims→routing-key→intent join (the stored claim's
    // agent_id keyed against the heartbeat author identity).
    expect(JSON.parse(result.stdout)).toMatchObject([
      {
        worktreePath: '/repo/oak-spawn-flow',
        branch: 'feat/spawn-worktree-view',
        agent: { agent_name: 'Kingfisher seeks Moorings' },
        intent: 'Lane A Phase 2 derived worktree view',
        lastSeen: { state: 'active', at: '2026-06-28T11:59:00Z' },
      },
      { worktreePath: '/repo/primary', branch: 'coordination/team-tooling' },
    ]);
  });

  it('rejects a malformed --now with a clear error (guards the NaN-to-retired hazard)', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: [] }, worktrees });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'claims',
        'work-state',
        '--active',
        activePath,
        '--comms-dir',
        commsDir,
        '--now',
        'not-a-date',
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--now must be an ISO-8601 timestamp (got: not-a-date)');
  });
});
