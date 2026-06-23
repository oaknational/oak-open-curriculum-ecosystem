import { describe, expect, it } from 'vitest';

import {
  extractEventIdTokens,
  findUncoveredCitedEvents,
  normaliseEventId,
} from '../../../src/collaboration-state/provenance/cited-event-provenance';

describe('normaliseEventId', () => {
  it('reduces a full UUID to its lowercased 8-hex prefix', () => {
    expect(normaliseEventId('2FF03DED-1234-4abc-9def-0123456789ab')).toBe('2ff03ded');
  });

  it('passes an 8-hex prefix through unchanged (lowercased)', () => {
    expect(normaliseEventId('3CC1FB93')).toBe('3cc1fb93');
  });
});

describe('extractEventIdTokens', () => {
  it('extracts lowercased 8-hex tokens from prose, deduped', () => {
    const text = 'See events 2ff03ded and 3cc1fb93; and again 2ff03ded later.';
    expect([...extractEventIdTokens(text)].sort((a, b) => a.localeCompare(b))).toEqual([
      '2ff03ded',
      '3cc1fb93',
    ]);
  });

  it('captures the 8-hex prefix of a full UUID citation', () => {
    const text = 'event `86e94e54-aaaa-4bbb-8ccc-1234567890ab`';
    expect([...extractEventIdTokens(text)]).toContain('86e94e54');
  });

  it('does not extract an 8-hex prefix from a longer hex run (e.g. a git SHA)', () => {
    // A contiguous hex run longer than 8 chars has no interior word boundary, so
    // the bounded {8} pattern never matches a window inside a full git SHA.
    const sha = 'a1b2c3d4e5f67890aabbccddeeff00112233445566';
    expect([...extractEventIdTokens(sha)]).toEqual([]);
  });

  it('ignores tokens that are not exactly 8 hex characters (no false positives)', () => {
    // 7-hex (abc1234, 1234567), 9-hex (deadbeef0), and non-hex (zzzzzzzz) must
    // never be captured — only exactly-8-hex bounded tokens are event-id prefixes.
    // This is also what excludes longer git SHAs from the scan.
    const text = 'abc1234 deadbeef0 not-hex 1234567 zzzzzzzz';
    expect([...extractEventIdTokens(text)]).toEqual([]);
  });
});

describe('findUncoveredCitedEvents', () => {
  it('flags an event that is cited AND in the archive candidate set AND not covered', () => {
    const violations = findUncoveredCitedEvents({
      citedEventIds: ['2ff03ded', '5fbf6f92'],
      candidateEventIds: ['2ff03ded', '5fbf6f92', 'deadbeef'],
      coveredEventIds: ['2ff03ded'],
    });
    expect(violations).toEqual(['5fbf6f92']);
  });

  it('does not flag a cited-but-uncovered event that is NOT being moved (stays live)', () => {
    const violations = findUncoveredCitedEvents({
      citedEventIds: ['1e2c83eb'],
      candidateEventIds: ['deadbeef'],
      coveredEventIds: [],
    });
    expect(violations).toEqual([]);
  });

  it('returns empty when every cited candidate is covered (the pass case)', () => {
    const violations = findUncoveredCitedEvents({
      citedEventIds: ['02fa64cf', '92183937'],
      candidateEventIds: ['02fa64cf', '92183937'],
      coveredEventIds: ['02fa64cf', '92183937', 'c7d65a58'],
    });
    expect(violations).toEqual([]);
  });

  it('normalises full UUIDs on every axis before comparing, and returns sorted prefixes', () => {
    const violations = findUncoveredCitedEvents({
      citedEventIds: ['952E329B-0000-4000-8000-000000000000', '5fbf6f92'],
      candidateEventIds: ['952e329b', '5FBF6F92-1111-4111-8111-111111111111'],
      coveredEventIds: [],
    });
    expect(violations).toEqual(['5fbf6f92', '952e329b']);
  });
});
