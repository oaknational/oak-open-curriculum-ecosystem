import { describe, expect, it } from 'vitest';

import {
  completeCommitIntent,
  createStagedBundleFingerprint,
  formatCommitQueueStatus,
  formatCommitQueueListText,
  formatCommitQueueStatusText,
  formatCommitQueueShowText,
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

  it('rejects invalid freshness clocks instead of treating them as inactive', () => {
    const selected = intent({
      intent_id: '22222222-2222-4222-8222-222222222222',
      files: ['agent-tools/tests/commit-queue.unit.test.ts'],
    });

    expect(() =>
      getFreshEntriesAhead([intent(), selected], selected.intent_id, 'not-a-date'),
    ).toThrow('invalid ISO date-time for now: not-a-date');
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

  it('warns when active-claims keeps the fingerprint as an unstaged split', () => {
    const stagedNameStatus = 'M\t.agent/state/collaboration/active-claims.json\n';
    const stagedPatch =
      'diff --git a/.agent/state/collaboration/active-claims.json ' +
      'b/.agent/state/collaboration/active-claims.json\n';
    const stagedBundleFingerprint = createStagedBundleFingerprint({
      nameStatus: stagedNameStatus,
      patch: stagedPatch,
    });

    const result = verifyStagedBundle({
      intent: intent({
        files: ['.agent/state/collaboration/active-claims.json'],
        staged_bundle_fingerprint: stagedBundleFingerprint,
      }),
      stagedNameOnly: '.agent/state/collaboration/active-claims.json\n',
      stagedNameStatus,
      stagedPatch,
      worktreeShortStatus: 'MM .agent/state/collaboration/active-claims.json\n',
      commitSubject: 'feat(queue): add commit queue helper',
    });

    expect(result).toStrictEqual({
      ok: true,
      fingerprint: stagedBundleFingerprint,
      warning:
        '.agent/state/collaboration/active-claims.json has an unstaged ' +
        'commit-queue fingerprint after record-staged; do not re-stage it.',
    });
  });

  it('rejects a re-staged active-claims fingerprint with corrective guidance', () => {
    const originalFingerprint = createStagedBundleFingerprint({
      nameStatus: 'M\t.agent/state/collaboration/active-claims.json\n',
      patch:
        'diff --git a/.agent/state/collaboration/active-claims.json ' +
        'b/.agent/state/collaboration/active-claims.json\n',
    });

    const result = verifyStagedBundle({
      intent: intent({
        files: ['.agent/state/collaboration/active-claims.json'],
        staged_bundle_fingerprint: originalFingerprint,
      }),
      stagedNameOnly: '.agent/state/collaboration/active-claims.json\n',
      stagedNameStatus: 'M\t.agent/state/collaboration/active-claims.json\n',
      stagedPatch:
        'diff --git a/.agent/state/collaboration/active-claims.json ' +
        'b/.agent/state/collaboration/active-claims.json\n' +
        '+      "staged_bundle_fingerprint": "abc",\n',
      worktreeShortStatus: 'M  .agent/state/collaboration/active-claims.json\n',
      commitSubject: 'feat(queue): add commit queue helper',
    });

    expect(result).toStrictEqual({
      ok: false,
      reason:
        'active-claims.json was re-staged after record-staged; the queue ' +
        'fingerprint changes its own staged payload. Leave the working-tree ' +
        'fingerprint unstaged and rerun verify-staged.',
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

describe('formatCommitQueueStatus', () => {
  it('classifies active, expired, and abandoned queue entries', () => {
    const registry: CommitQueueRegistry = {
      schema_version: '1.3.0',
      claims: [],
      commit_queue: [
        intent({
          intent_id: '11111111-1111-4111-8111-111111111111',
          phase: 'queued',
          expires_at: '2026-04-27T07:35:00Z',
        }),
        intent({
          intent_id: '22222222-2222-4222-8222-222222222222',
          phase: 'pre_commit',
          expires_at: '2026-04-27T07:00:00Z',
        }),
        intent({
          intent_id: '33333333-3333-4333-8333-333333333333',
          phase: 'abandoned',
          expires_at: '2026-04-27T07:35:00Z',
        }),
      ],
    };

    expect(formatCommitQueueStatus(registry, now)).toMatchObject({
      total: 3,
      active: 1,
      expired: 1,
      abandoned: 1,
      entries: [
        { intent_id: '11111111-1111-4111-8111-111111111111', queue_status: 'active' },
        { intent_id: '22222222-2222-4222-8222-222222222222', queue_status: 'expired' },
        { intent_id: '33333333-3333-4333-8333-333333333333', queue_status: 'abandoned' },
      ],
    });
  });

  it('formats commit-queue status as JSON text', () => {
    const registry: CommitQueueRegistry = {
      schema_version: '1.3.0',
      claims: [],
      commit_queue: [intent()],
    };

    expect(JSON.parse(formatCommitQueueStatusText(registry, now))).toMatchObject({
      total: 1,
      active: 1,
      expired: 0,
      abandoned: 0,
      entries: [{ intent_id: '11111111-1111-4111-8111-111111111111' }],
    });
  });
});

describe('commit-queue read APIs', () => {
  const registry: CommitQueueRegistry = {
    schema_version: '1.3.0',
    claims: [],
    commit_queue: [
      intent({
        intent_id: '11111111-1111-4111-8111-111111111111',
        phase: 'queued',
      }),
      intent({
        intent_id: '22222222-2222-4222-8222-222222222222',
        phase: 'pre_commit',
        files: ['agent-tools/src/commit-queue/status.ts'],
      }),
      intent({
        intent_id: '33333333-3333-4333-8333-333333333333',
        phase: 'abandoned',
      }),
      intent({
        intent_id: '44444444-4444-4444-8444-444444444444',
        agent_id: {
          ...agentId,
          agent_name: 'Prismatic Waxing Anchor',
        },
        expires_at: '2026-04-27T07:00:00Z',
      }),
    ],
  };

  it('formats a filtered commit-queue list', () => {
    expect(
      JSON.parse(
        formatCommitQueueListText(registry, now, {
          phase: 'pre_commit',
          prefix: '2222',
        }),
      ),
    ).toMatchObject([
      {
        intent_id: '22222222-2222-4222-8222-222222222222',
        phase: 'pre_commit',
        queue_status: 'active',
      },
    ]);
  });

  it('filters commit-queue list entries by agent name and derived queue status', () => {
    expect(
      JSON.parse(
        formatCommitQueueListText(registry, now, {
          agentName: 'Prismatic Waxing A',
          queueStatus: 'expired',
        }),
      ),
    ).toMatchObject([
      {
        intent_id: '44444444-4444-4444-8444-444444444444',
        agent_id: { agent_name: 'Prismatic Waxing Anchor' },
        queue_status: 'expired',
      },
    ]);
  });

  it('formats one exact commit-queue entry for show', () => {
    expect(
      JSON.parse(formatCommitQueueShowText(registry, now, '22222222-2222-4222-8222-222222222222')),
    ).toMatchObject({
      intent_id: '22222222-2222-4222-8222-222222222222',
      files: ['agent-tools/src/commit-queue/status.ts'],
    });
  });

  it('rejects commit-queue show for an unknown intent id', () => {
    expect(() =>
      formatCommitQueueShowText(registry, now, '99999999-9999-4999-8999-999999999999'),
    ).toThrow('unknown intent_id: 99999999-9999-4999-8999-999999999999');
  });

  it('rejects invalid expiry timestamps instead of presenting them as active', () => {
    const invalidRegistry: CommitQueueRegistry = {
      schema_version: '1.3.0',
      claims: [],
      commit_queue: [intent({ expires_at: 'not-a-date' })],
    };

    expect(() => formatCommitQueueStatus(invalidRegistry, now)).toThrow(
      'invalid ISO date-time for expires_at: not-a-date',
    );
  });

  it('rejects calendar-overflow expiry timestamps instead of normalising them', () => {
    const invalidRegistry: CommitQueueRegistry = {
      schema_version: '1.3.0',
      claims: [],
      commit_queue: [intent({ expires_at: '2026-02-31T07:35:00Z' })],
    };

    expect(() => formatCommitQueueStatus(invalidRegistry, now)).toThrow(
      'invalid ISO date-time for expires_at: 2026-02-31T07:35:00Z',
    );
  });
});
