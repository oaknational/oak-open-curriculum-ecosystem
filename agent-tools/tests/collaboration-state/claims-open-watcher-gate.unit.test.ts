/**
 * Covers the F-95 claims-open precondition (`assertWatcherPresentForClaimOpen`)
 * with an injected staleness IO, no filesystem:
 *
 * - a solo registry (no OTHER live agent) passes even with no watcher — the
 *   bootstrap fast-path is preserved (the load-bearing solo-safety case);
 * - another live agent present + a live watcher passes;
 * - another live agent present + an absent/aged watcher throws (the founding
 *   failure: a blind claim into a populated registry);
 * - a same-routing-key (own duplicate) claim does NOT count as "other";
 * - an active commit-queue entry from another agent DOES count as "other".
 */
import { describe, expect, it } from 'vitest';

import { deriveCollaborationIdentity } from '../../src/collaboration-state';
import { assertWatcherPresentForClaimOpen } from '../../src/collaboration-state/claims-open-watcher-gate';
import {
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
} from '../../src/collaboration-state/types';
import { type WatcherStalenessIo } from '../../src/collaboration-state/watcher-staleness';

const self: CollaborationAgentId = deriveCollaborationIdentity({
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: 'Seal hunts Offing',
    PRACTICE_AGENT_SESSION_ID_CLAUDE: '8210d6',
  },
}).agentId;

const other: CollaborationAgentId = deriveCollaborationIdentity({
  platform: 'codex',
  model: 'GPT-5',
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: 'Woodland Creeping Petal',
    PRACTICE_AGENT_SESSION_ID_CODEX: '019dd3',
  },
}).agentId;

const nowIso = '2026-06-25T08:00:00.000Z';
const nowMs = Date.parse(nowIso);
const commsSeenDir = '.agent/state/collaboration/comms-seen';

function claimOf(agent: CollaborationAgentId, claimId: string): CollaborationClaim {
  return {
    claim_id: claimId,
    agent_id: agent,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
    claimed_at: nowIso,
    freshness_seconds: 14400,
    sidebar_open: false,
    intent: 'test',
  };
}

function registry(input: {
  readonly claims?: readonly CollaborationClaim[];
  readonly queue?: readonly CollaborationCommitQueueEntry[];
}): CollaborationRegistry {
  return {
    schema_version: '1.3.0',
    commit_queue: input.queue ?? [],
    claims: input.claims ?? [],
  };
}

function heartbeatText(lastEmitAt: string | null): string {
  return JSON.stringify({
    schema_version: '0.1.0',
    pid: 1,
    started_at: nowIso,
    last_drain_at: lastEmitAt,
    last_emit_at: lastEmitAt,
    last_error_at: null,
    emitted_count: lastEmitAt === null ? 0 : 1,
    heartbeat_interval_ms: 30000,
    watcher_identity: self,
  });
}

function io(mtime: number | 'missing', text = heartbeatText(nowIso)): WatcherStalenessIo {
  return {
    statMtimeMs: () => Promise.resolve(mtime),
    readTextFile: () => Promise.resolve(text),
  };
}

async function run(input: {
  readonly registry: CollaborationRegistry;
  readonly io: WatcherStalenessIo;
}): Promise<void> {
  await assertWatcherPresentForClaimOpen({
    registry: input.registry,
    nowIso,
    nowMs,
    selfIdentity: self,
    commsSeenDir,
    io: input.io,
  });
}

describe('assertWatcherPresentForClaimOpen', () => {
  it('passes a solo registry even with no watcher (bootstrap fast-path)', async () => {
    await expect(run({ registry: registry({}), io: io('missing') })).resolves.toBeUndefined();
  });

  it('passes when another agent is live and this session has a live watcher', async () => {
    await expect(
      run({ registry: registry({ claims: [claimOf(other, 'c-other')] }), io: io(nowMs - 1000) }),
    ).resolves.toBeUndefined();
  });

  it('throws when another agent is live but this session has no watcher heartbeat', async () => {
    await expect(
      run({ registry: registry({ claims: [claimOf(other, 'c-other')] }), io: io('missing') }),
    ).rejects.toThrow(/blind to comms/);
  });

  it('throws when another agent is live but this session’s watcher is aged out', async () => {
    await expect(
      run({
        registry: registry({ claims: [claimOf(other, 'c-other')] }),
        io: io(nowMs - 10_000_000),
      }),
    ).rejects.toThrow(/blind to comms/);
  });

  it('treats an own-routing-key duplicate claim as not-other (fast-path, no watcher needed)', async () => {
    await expect(
      run({ registry: registry({ claims: [claimOf(self, 'c-self-dup')] }), io: io('missing') }),
    ).resolves.toBeUndefined();
  });

  it('counts an active commit-queue entry from another agent as a live other agent', async () => {
    const queueEntry: CollaborationCommitQueueEntry = {
      intent_id: 'i-1',
      claim_id: 'c-other',
      agent_id: other,
      files: ['agent-tools/x.ts'],
      commit_subject: 'feat: x',
      queued_at: nowIso,
      updated_at: nowIso,
      expires_at: '2026-06-25T12:00:00.000Z',
      phase: 'queued',
    };
    await expect(
      run({ registry: registry({ queue: [queueEntry] }), io: io('missing') }),
    ).rejects.toThrow(/blind to comms/);
  });
});
