import { describe, expect, it } from 'vitest';

import {
  collaborationAgentIdSchema,
  collaborationAgentIdWriteSchema,
  uuidV5Schema,
} from '../../src/collaboration-state/types.js';

describe('uuidV5Schema (PDR-076a §Cascade item 3; deterministic UUID v5 brand)', () => {
  it('parses a UUID v5 string and yields a UuidV5-branded value', () => {
    const parsed = uuidV5Schema.parse('886313e1-3b8a-5372-9b90-0c9aee199e5d');
    expect(parsed).toBe('886313e1-3b8a-5372-9b90-0c9aee199e5d');
  });

  it('rejects a non-UUID string', () => {
    expect(() => uuidV5Schema.parse('not-a-uuid')).toThrow();
  });

  it('rejects a UUID v4 (version nibble at position 14 is not 5)', () => {
    expect(() => uuidV5Schema.parse('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toThrow();
  });
});

describe('collaborationAgentIdSchema (read-side; optional id, accepts legacy rows)', () => {
  it('parses an identity tuple WITH id (canonical post-2026-05-26 shape)', () => {
    const parsed = collaborationAgentIdSchema.parse({
      agent_name: 'Open Streaming Updraft',
      platform: 'claude',
      model: 'opus-4-7',
      session_id_prefix: '357948',
      id: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
    });
    expect(parsed.id).toBe('886313e1-3b8a-5372-9b90-0c9aee199e5d');
  });

  it('parses an identity tuple WITHOUT id (legacy compatibility path)', () => {
    const parsed = collaborationAgentIdSchema.parse({
      agent_name: 'Legacy Agent',
      platform: 'claude',
      model: 'opus-4-7',
      session_id_prefix: 'abc123',
    });
    expect(parsed.id).toBeUndefined();
  });
});

describe('collaborationAgentIdWriteSchema (write-side; required id, blocks legacy emission)', () => {
  it('rejects an identity tuple without id (write paths MUST carry id post-amendment)', () => {
    expect(() =>
      collaborationAgentIdWriteSchema.parse({
        agent_name: 'Open Streaming Updraft',
        platform: 'claude',
        model: 'opus-4-7',
        session_id_prefix: '357948',
      }),
    ).toThrow();
  });

  it('parses an identity tuple with id', () => {
    const parsed = collaborationAgentIdWriteSchema.parse({
      agent_name: 'Open Streaming Updraft',
      platform: 'claude',
      model: 'opus-4-7',
      session_id_prefix: '357948',
      id: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
    });
    expect(parsed.id).toBe('886313e1-3b8a-5372-9b90-0c9aee199e5d');
  });
});
