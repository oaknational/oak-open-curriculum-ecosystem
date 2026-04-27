import { describe, expect, it } from 'vitest';

import {
  completeCommitIntent,
  createStagedBundleFingerprint,
  getFreshEntriesAhead,
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueRegistry,
  verifyStagedBundle,
} from '../src/commit-queue';

const agentId: CommitQueueAgentId = {
  agent_name: 'Prismatic Waxing Constellation',
  platform: 'codex',
  model: 'gpt-5.5',
  session_id_prefix: '019dcd',
};

const queuedAt = '2026-04-27T07:20:00Z';
const expiresAt = '2026-04-27T07:35:00Z';
const now = '2026-04-27T07:25:00Z';

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
    ...overrides,
  };
}

describe('getFreshEntriesAhead', () => {
  it('returns fresh non-terminal queue entries before the selected intent', () => {
    const first = intent({
      intent_id: '11111111-1111-4111-8111-111111111111',
      phase: 'pre_commit',
    });
    const selected = intent({
      intent_id: '22222222-2222-4222-8222-222222222222',
      files: ['agent-tools/src/commit-queue/commit-queue.ts'],
    });
    const abandoned = intent({
      intent_id: '33333333-3333-4333-8333-333333333333',
      phase: 'abandoned',
    });

    expect(
      getFreshEntriesAhead([first, abandoned, selected], selected.intent_id, now),
    ).toStrictEqual([first]);
  });

  it('ignores expired entries when computing queue ownership', () => {
    const expired = intent({
      intent_id: '11111111-1111-4111-8111-111111111111',
      expires_at: '2026-04-27T07:00:00Z',
    });
    const selected = intent({
      intent_id: '22222222-2222-4222-8222-222222222222',
      files: ['agent-tools/tests/commit-queue.unit.test.ts'],
    });

    expect(getFreshEntriesAhead([expired, selected], selected.intent_id, now)).toStrictEqual([]);
  });
});

describe('verifyStagedBundle', () => {
  it('accepts an exact declared file set, subject, and staged fingerprint', () => {
    const stagedNameStatus = 'M\tagent-tools/src/commit-queue/index.ts\n';
    const stagedPatch =
      'diff --git a/agent-tools/src/commit-queue/index.ts b/agent-tools/src/commit-queue/index.ts\n';
    const stagedBundleFingerprint = createStagedBundleFingerprint({
      nameStatus: stagedNameStatus,
      patch: stagedPatch,
    });

    const result = verifyStagedBundle({
      intent: intent({ staged_bundle_fingerprint: stagedBundleFingerprint }),
      stagedNameOnly: 'agent-tools/src/commit-queue/index.ts\n',
      stagedNameStatus,
      stagedPatch,
      commitSubject: 'feat(queue): add commit queue helper',
    });

    expect(result).toStrictEqual({
      ok: true,
      fingerprint: stagedBundleFingerprint,
    });
  });

  it('rejects staged accretion beyond the declared file set', () => {
    const result = verifyStagedBundle({
      intent: intent(),
      stagedNameOnly:
        'agent-tools/src/commit-queue/index.ts\n.agent/state/collaboration/active-claims.json\n',
      stagedNameStatus: '',
      stagedPatch: '',
      commitSubject: 'feat(queue): add commit queue helper',
    });

    expect(result).toStrictEqual({
      ok: false,
      reason:
        'staged files do not exactly match intent files; extra: ' +
        '.agent/state/collaboration/active-claims.json; missing: none',
    });
  });

  it('rejects staged disappearance from the declared file set', () => {
    const result = verifyStagedBundle({
      intent: intent({
        files: [
          'agent-tools/src/commit-queue/index.ts',
          'agent-tools/tests/commit-queue.unit.test.ts',
        ],
      }),
      stagedNameOnly: 'agent-tools/src/commit-queue/index.ts\n',
      stagedNameStatus: '',
      stagedPatch: '',
      commitSubject: 'feat(queue): add commit queue helper',
    });

    expect(result).toStrictEqual({
      ok: false,
      reason:
        'staged files do not exactly match intent files; extra: none; ' +
        'missing: agent-tools/tests/commit-queue.unit.test.ts',
    });
  });

  it('rejects a changed staged bundle fingerprint', () => {
    const originalFingerprint = createStagedBundleFingerprint({
      nameStatus: 'M\tagent-tools/src/commit-queue/index.ts\n',
      patch: 'original patch\n',
    });

    const result = verifyStagedBundle({
      intent: intent({ staged_bundle_fingerprint: originalFingerprint }),
      stagedNameOnly: 'agent-tools/src/commit-queue/index.ts\n',
      stagedNameStatus: 'M\tagent-tools/src/commit-queue/index.ts\n',
      stagedPatch: 'changed patch\n',
      commitSubject: 'feat(queue): add commit queue helper',
    });

    expect(result).toStrictEqual({
      ok: false,
      reason: 'staged bundle fingerprint changed since it was recorded',
    });
  });
});

describe('completeCommitIntent', () => {
  it('removes the completed queue entry and clears the owning claim pointer', () => {
    const registry: CommitQueueRegistry = {
      schema_version: '1.3.0',
      commit_queue: [intent()],
      claims: [
        {
          claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          agent_id: agentId,
          thread: 'agentic-engineering-enhancements',
          areas: [{ kind: 'files', patterns: ['agent-tools/src/commit-queue/index.ts'] }],
          claimed_at: queuedAt,
          intent: 'Implement the queue helper.',
          intent_to_commit: '11111111-1111-4111-8111-111111111111',
        },
      ],
    };

    expect(
      completeCommitIntent({
        registry,
        intentId: '11111111-1111-4111-8111-111111111111',
      }),
    ).toStrictEqual({
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [
        {
          claim_id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
          agent_id: agentId,
          thread: 'agentic-engineering-enhancements',
          areas: [{ kind: 'files', patterns: ['agent-tools/src/commit-queue/index.ts'] }],
          claimed_at: queuedAt,
          intent: 'Implement the queue helper.',
        },
      ],
    });
  });
});
