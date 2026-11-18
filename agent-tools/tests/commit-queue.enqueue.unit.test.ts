/**
 * The queue's append invariant, split from `commit-queue.unit.test.ts` so
 * the enqueue contract — what an append touches, and what it refuses —
 * reads as one file.
 */
import { describe, expect, it } from 'vitest';

import { uuidV5Schema, type CollaborationAgentIdWrite } from '../src/collaboration-state/agent-id';
import { enqueueCommitIntent } from '../src/commit-queue/enqueue';
import { type CommitIntent, type CommitQueueRegistry } from '../src/commit-queue';

const agentId: CollaborationAgentIdWrite = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
  // Deterministic v5 derived from '019dcd' under the collaboration-identity
  // namespace; used as a stable fixture for write-side identity contracts.
  id: uuidV5Schema.parse('e2e793c7-923e-5baa-97f0-2bedfb9b6b50'),
};

const queuedAt = '2026-04-27T07:20:00Z';
const expiresAt = '2026-04-27T07:35:00Z';

function intent(overrides: Partial<CommitIntent> = {}): CommitIntent {
  return {
    intent_id: '11111111-1111-4111-8111-111111111111',
    claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    agent_id: agentId,
    files: ['agent-tools/src/commit-queue/index.ts'],
    commit_subject: 'feat(queue): add commit queue helper',
    queued_at: queuedAt,
    updated_at: queuedAt,
    expires_at: expiresAt,
    phase: 'queued',
    queued_seq: 0,
    ...overrides,
  };
}

describe('enqueueCommitIntent', () => {
  it('appends the queue entry and leaves claim rows untouched', () => {
    // The store entry carries claim_id, so the claims file needs no pointer
    // back — and writing one would re-open the split-write crash window
    // (claims committed before the intent file exists).
    const claims = [
      {
        claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        agent_id: agentId,
        thread: 'agentic-engineering-enhancements',
        areas: [{ kind: 'files', patterns: ['agent-tools/src/commit-queue/index.ts'] }],
        claimed_at: queuedAt,
        intent: 'Implement the queue helper.',
      },
    ];
    const registry: CommitQueueRegistry = {
      schema_version: '1.4.0',
      commit_queue: [],
      claims,
    };

    expect(enqueueCommitIntent({ registry, draft: intent() })).toStrictEqual({
      schema_version: '1.4.0',
      commit_queue: [intent()],
      claims,
    });
  });

  it('refuses an intent id the queue already carries instead of replacing the live entry', () => {
    // The store publishes one file per intent id, so a second enqueue of a
    // live id used to OVERWRITE its file: the peer holding that id lost its
    // queued bundle silently, and the queue's ordering invariant lost an
    // entry. This is the duplicate cure; exclusive create in the store is
    // defence-in-depth behind it.
    const registry: CommitQueueRegistry = {
      schema_version: '1.4.0',
      claims: [],
      commit_queue: [intent()],
    };

    expect(() => enqueueCommitIntent({ registry, draft: intent() })).toThrow(
      'commit queue intent already exists: 11111111-1111-4111-8111-111111111111',
    );
  });
});
