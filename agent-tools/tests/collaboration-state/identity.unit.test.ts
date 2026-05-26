import { describe, expect, it } from 'vitest';

import { deriveCollaborationIdentity } from '../../src/collaboration-state';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity.js';
import { type CollaborationAgentIdWrite } from '../../src/collaboration-state/types.js';

const uuidV5Pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

const codexThreadId = '019dd34d-cb6a-74e0-a29d-6cb8a65ea14b';
const otherCodexThreadId = '019eeeee-cb6a-74e0-a29d-6cb8a65ea14b';

describe('deriveCollaborationIdentity', () => {
  it('names the supported identity seed variables when no seed is available', () => {
    expect(() =>
      deriveCollaborationIdentity({
        platform: 'codex',
        model: 'GPT-5',
        env: {},
      }),
    ).toThrow(
      'missing collaboration identity seed; set one of PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_CODEX, or CODEX_THREAD_ID. For codex, the primary Practice seed is PRACTICE_AGENT_SESSION_ID_CODEX or CODEX_THREAD_ID.',
    );
  });

  it('derives a deterministic UUID v5 id from the stable session seed', () => {
    const first = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    });
    const second = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    });

    expect(first.agentId.id).toMatch(uuidV5Pattern);
    expect(first.agentId.id).toBe(second.agentId.id);
  });

  it('derives different ids from different session seeds', () => {
    const a = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    });
    const b = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: otherCodexThreadId },
    });

    expect(a.agentId.id).not.toBe(b.agentId.id);
  });

  it('returns CollaborationAgentIdWrite (compile-time enforced via assignment)', () => {
    const result = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    });

    // If `agentId` is not CollaborationAgentIdWrite, this assignment fails at
    // compile time (id is required on Write, optional on read-side).
    const write: CollaborationAgentIdWrite = result.agentId;
    expect(write.id).toBeDefined();
  });
});

describe('deriveOverrideCollaborationIdentity', () => {
  it('derives a deterministic UUID v5 id from the override fields (no env seed required)', () => {
    const id = deriveOverrideCollaborationIdentity({
      agent_name: 'Override Test',
      platform: 'claude',
      model: 'opus-4-7',
      session_id_prefix: 'override-prefix',
    });

    expect(id.id).toMatch(uuidV5Pattern);
  });

  it('derives a stable id from the same override fields', () => {
    const overrides = {
      agent_name: 'Override Test',
      platform: 'claude',
      model: 'opus-4-7',
      session_id_prefix: 'override-prefix',
    } as const;

    const first = deriveOverrideCollaborationIdentity(overrides);
    const second = deriveOverrideCollaborationIdentity(overrides);
    expect(first.id).toBe(second.id);
  });

  it('derives different ids when override agent_name or session_id_prefix differs', () => {
    const base = {
      platform: 'claude',
      model: 'opus-4-7',
    } as const;

    const a = deriveOverrideCollaborationIdentity({
      ...base,
      agent_name: 'Override A',
      session_id_prefix: 'abc123',
    });
    const b = deriveOverrideCollaborationIdentity({
      ...base,
      agent_name: 'Override B',
      session_id_prefix: 'abc123',
    });
    const c = deriveOverrideCollaborationIdentity({
      ...base,
      agent_name: 'Override A',
      session_id_prefix: 'xyz789',
    });

    expect(a.id).not.toBe(b.id);
    expect(a.id).not.toBe(c.id);
    expect(b.id).not.toBe(c.id);
  });
});
