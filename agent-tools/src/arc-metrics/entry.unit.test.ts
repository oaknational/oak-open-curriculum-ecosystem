import { describe, expect, it } from 'vitest';

import { eventTimeOf, parseEntry, type Entry } from './entry.js';

function entryOf(record: Record<string, unknown>): Entry {
  const entry = parseEntry(JSON.stringify(record));
  if (entry === undefined) {
    throw new Error('fixture did not parse');
  }
  return entry;
}

describe('eventTimeOf', () => {
  it('reads the time of a timestamped entry of any class', () => {
    const entry = entryOf({ type: 'attachment', timestamp: '2026-09-16T10:00:00Z' });

    expect(eventTimeOf(entry)).toBe(Date.parse('2026-09-16T10:00:00Z'));
  });

  it('reads no event from the recap the harness writes once the owner is away', () => {
    const entry = entryOf({
      type: 'system',
      subtype: 'away_summary',
      timestamp: '2026-09-16T10:03:00Z',
    });

    expect(eventTimeOf(entry)).toBeNull();
  });
});
