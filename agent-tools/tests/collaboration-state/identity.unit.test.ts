import { describe, expect, it } from 'vitest';

import { deriveCollaborationIdentity } from '../../src/collaboration-state';

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
});
