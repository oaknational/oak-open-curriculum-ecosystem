import { describe, expect, it } from 'vitest';

import { deriveCollaborationIdentity } from '../../src/collaboration-state';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity.js';
import {
  collaborationAgentIdSchema,
  namingSchemaVersionOf,
  type CollaborationAgentIdWrite,
} from '../../src/collaboration-state/types.js';

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
      'missing collaboration identity seed; set one of PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, or Antigravity conversationId. For codex, the primary Practice seed is PRACTICE_AGENT_SESSION_ID_CODEX or CODEX_THREAD_ID.',
    );
  });

  it('names the Antigravity/Gemini seed surfaces for Antigravity preflight', () => {
    expect(() =>
      deriveCollaborationIdentity({
        platform: 'antigravity',
        model: 'Claude Opus 4.6 (Thinking)',
        env: {},
      }),
    ).toThrow(
      'missing collaboration identity seed; set one of PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, PRACTICE_AGENT_SESSION_ID_GEMINI, PRACTICE_AGENT_SESSION_ID_CODEX, CODEX_THREAD_ID, or Antigravity conversationId. For antigravity, the primary Practice seed is PRACTICE_AGENT_SESSION_ID_GEMINI or Antigravity conversationId.',
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

  it('derives Antigravity identity from the Practice Gemini seed', () => {
    const result = deriveCollaborationIdentity({
      platform: 'antigravity',
      model: 'Claude Opus 4.6 (Thinking)',
      env: { PRACTICE_AGENT_SESSION_ID_GEMINI: 'antigravity-conversation-seed' },
    });

    expect(result.seed_source).toBe('PRACTICE_AGENT_SESSION_ID_GEMINI');
    expect(result.agentId.platform).toBe('antigravity');
    expect(result.agentId.session_id_prefix).toBe('antigr');
    expect(result.agentId.id).toMatch(uuidV5Pattern);
  });

  it('derives Antigravity identity from source metadata conversationId fallback', () => {
    const result = deriveCollaborationIdentity({
      platform: 'antigravity',
      model: 'Claude Opus 4.6 (Thinking)',
      env: {
        ANTIGRAVITY_SOURCE_METADATA: JSON.stringify({
          conversationId: '0f8b2a6e-9fd0-4bd9-a319-33dc4815fa62',
          trajectoryId: 'volatile-run-id',
        }),
      },
    });

    expect(result.seed_source).toBe('ANTIGRAVITY_SOURCE_METADATA.conversationId');
    expect(result.agentId.session_id_prefix).toBe('0f8b2a');
    expect(result.agentId.id).toMatch(uuidV5Pattern);
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

describe('naming schema version on the identity tuple', () => {
  it('stamps derived identities with the active naming schema version', () => {
    const result = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    });

    expect(result.agentId.naming_schema_version).toBe('v2-noun-verb-noun');
  });

  it('stamps env-override identities with the override provenance marker', () => {
    const result = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId, OAK_AGENT_IDENTITY_OVERRIDE: 'Frolicking Toast' },
    });

    expect(result.agentId.naming_schema_version).toBe('override');
  });

  it('stamps admin-override identities with the override provenance marker', () => {
    const result = deriveOverrideCollaborationIdentity({
      agent_name: 'Override Test',
      platform: 'claude',
      model: 'opus-4-7',
      session_id_prefix: 'override-prefix',
    });

    expect(result.naming_schema_version).toBe('override');
  });

  it('reads legacy rows without the field as the v1 era, without injecting the field', () => {
    const parsed = collaborationAgentIdSchema.parse({
      agent_name: 'Legacy Agent',
      platform: 'claude',
      model: 'opus-4-5',
      session_id_prefix: 'abc123',
    });

    expect(parsed.naming_schema_version).toBeUndefined();
    expect(namingSchemaVersionOf(parsed)).toBe('v1-adjective-verb-noun');
  });

  it('rejects rows carrying an unregistered naming schema version', () => {
    expect(() =>
      collaborationAgentIdSchema.parse({
        agent_name: 'Future Agent',
        platform: 'claude',
        model: 'opus-4-5',
        session_id_prefix: 'abc123',
        naming_schema_version: 'v9-not-registered',
      }),
    ).toThrow();
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

describe('cloud platform session id seed (PDR-027 cloud-seat clause)', () => {
  const platformPayload = '01FV6rZz5BjSkApAUL6FAj72';

  it('resolves the stripped platform session id when no explicit Practice seed is set', () => {
    const identity = deriveCollaborationIdentity({
      platform: 'claude-code',
      model: 'claude',
      env: { CLAUDE_CODE_REMOTE_SESSION_ID: `cse_${platformPayload}` },
    });

    expect(identity.seed_source).toBe('CLAUDE_CODE_REMOTE_SESSION_ID');
    expect(identity.agentId.session_id_prefix).toBe('01FV6r');
  });

  it('lets an explicit Practice seed outrank the ambient platform session id', () => {
    const identity = deriveCollaborationIdentity({
      platform: 'claude-code',
      model: 'claude',
      env: {
        PRACTICE_AGENT_SESSION_ID_CLAUDE: 'explicit-operator-seed',
        CLAUDE_CODE_REMOTE_SESSION_ID: `cse_${platformPayload}`,
      },
    });

    expect(identity.seed_source).toBe('PRACTICE_AGENT_SESSION_ID_CLAUDE');
  });

  it('derives the same tuple from the tagged and untagged forms of one platform id', () => {
    const fromTagged = deriveCollaborationIdentity({
      platform: 'claude-code',
      model: 'claude',
      env: { CLAUDE_CODE_REMOTE_SESSION_ID: `cse_${platformPayload}` },
    });
    const fromUntagged = deriveCollaborationIdentity({
      platform: 'claude-code',
      model: 'claude',
      env: { PRACTICE_AGENT_SESSION_ID_CLAUDE: platformPayload },
    });

    expect(fromTagged.agentId.agent_name).toBe(fromUntagged.agentId.agent_name);
    expect(fromTagged.agentId.id).toBe(fromUntagged.agentId.id);
  });
});

describe('every explicit Practice seed outranks the ambient platform session id', () => {
  it.each([
    ['PRACTICE_AGENT_SESSION_ID_CURSOR', { PRACTICE_AGENT_SESSION_ID_CURSOR: 'cursor-seed' }],
    ['PRACTICE_AGENT_SESSION_ID_GEMINI', { PRACTICE_AGENT_SESSION_ID_GEMINI: 'gemini-seed' }],
    ['PRACTICE_AGENT_SESSION_ID_CODEX', { PRACTICE_AGENT_SESSION_ID_CODEX: 'codex-seed' }],
  ])('%s beats CLAUDE_CODE_REMOTE_SESSION_ID', (source, env) => {
    const identity = deriveCollaborationIdentity({
      platform: 'claude-code',
      model: 'claude',
      env: { ...env, CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72' },
    });

    expect(identity.seed_source).toBe(source);
  });

  it('the ambient platform id still outranks harness-native fallbacks', () => {
    const identity = deriveCollaborationIdentity({
      platform: 'claude-code',
      model: 'claude',
      env: {
        CODEX_THREAD_ID: '019dd34d-cb6a-74e0-a29d-6cb8a65ea14b',
        CLAUDE_CODE_REMOTE_SESSION_ID: 'cse_01FV6rZz5BjSkApAUL6FAj72',
      },
    });

    expect(identity.seed_source).toBe('CLAUDE_CODE_REMOTE_SESSION_ID');
  });
});
