import { describe, expect, it } from 'vitest';

import { manifestRowEventId } from '../../../src/collaboration-state/archive/manifest';

describe('manifestRowEventId', () => {
  it('returns the event_id of a well-formed manifest row', () => {
    const line = JSON.stringify({
      event_id: 'aaaaaaaa-1111-4111-8111-111111111111',
      created_at: '2026-06-01T00:00:00Z',
      kind: 'narrative',
      tags: ['heartbeat'],
      archived_at: '2026-06-14T12:00:00.000Z',
      disposition: 'routine',
    });
    expect(manifestRowEventId(line)).toBe('aaaaaaaa-1111-4111-8111-111111111111');
  });

  it('returns null for a crash-truncated final line rather than throwing (the resilience contract)', () => {
    // A crash between append and move can leave a half-written final line. It must
    // not brick the reader — it carries no usable id and is skipped.
    const truncated = '{"event_id":"aaaaaaaa","created_at":"2026-06-01T00:00:00Z","ki';
    expect(manifestRowEventId(truncated)).toBeNull();
  });

  it('returns null for an empty or whitespace line', () => {
    expect(manifestRowEventId('')).toBeNull();
    expect(manifestRowEventId('   ')).toBeNull();
  });

  it('returns null for valid JSON that is not an object', () => {
    expect(manifestRowEventId('"just a string"')).toBeNull();
    expect(manifestRowEventId('42')).toBeNull();
  });

  it('returns null for an object with no string event_id', () => {
    expect(manifestRowEventId(JSON.stringify({ created_at: '2026-06-01T00:00:00Z' }))).toBeNull();
    expect(manifestRowEventId(JSON.stringify({ event_id: 123 }))).toBeNull();
  });
});
