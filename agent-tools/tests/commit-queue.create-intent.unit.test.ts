/**
 * Direct unit tests for `createIntent` (Phase 0B Cycle 5). The Cycle 5
 * change replaces the hand-built `agent_id` block with a
 * `collaborationAgentIdWriteSchema.parse()` call — id required at the
 * write boundary, v5 brand enforced.
 */
import { describe, expect, it } from 'vitest';

import { createIntent } from '../src/commit-queue/intent.js';
import { type CommitQueueCliOptions } from '../src/commit-queue/types.js';

const validV5 = 'e2e793c7-923e-5baa-97f0-2bedfb9b6b50';

function options(overrides: Partial<CommitQueueCliOptions> = {}): CommitQueueCliOptions {
  return {
    file: ['agent-tools/src/index.ts'],
    'claim-id': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    'agent-name': 'Prismatic Waxing Constellation',
    platform: 'codex',
    model: 'gpt-5.5',
    'session-id-prefix': '019dcd',
    id: validV5,
    'commit-subject': 'feat(test): exercise createIntent identity contract',
    now: '2099-01-01T00:00:00Z',
    ...overrides,
  };
}

describe('createIntent — write-side identity contract (Cycle 5)', () => {
  it('emits an intent whose agent_id carries the v5 id supplied via --id', () => {
    const intent = createIntent(options());
    expect(intent.agent_id.id).toBe(validV5);
    expect(intent.agent_id.agent_name).toBe('Prismatic Waxing Constellation');
  });

  it('rejects an intent when --id is missing (PDR-076a write-side enforcement)', () => {
    const optsWithoutId: CommitQueueCliOptions = {
      file: ['agent-tools/src/index.ts'],
      'claim-id': 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      'agent-name': 'Prismatic Waxing Constellation',
      platform: 'codex',
      model: 'gpt-5.5',
      'session-id-prefix': '019dcd',
      'commit-subject': 'feat(test): exercise createIntent identity contract',
      now: '2099-01-01T00:00:00Z',
    };
    expect(() => createIntent(optsWithoutId)).toThrow();
  });

  it('rejects an intent when --id is malformed (non-UUID string)', () => {
    expect(() => createIntent(options({ id: 'not-a-uuid' }))).toThrow();
  });

  it('rejects an intent when --id is a UUID v4 (version nibble != 5)', () => {
    expect(() => createIntent(options({ id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }))).toThrow();
  });
});
