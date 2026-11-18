import { describe, expect, it } from 'vitest';

import { parseRecordedHarvest } from '../../src/pr-tally/harvest.js';
import pr135 from './fixtures/pr-135-harvest.json' with { type: 'json' };

describe('parseRecordedHarvest', () => {
  it('reads a recorded harvest: the four connections, commits in branch order', () => {
    const harvest = parseRecordedHarvest(pr135);
    expect(harvest.number).toBe(135);
    expect(harvest.commits.map((commit) => commit.oid.slice(0, 9))).toStrictEqual([
      '712abe242',
      '7f2426877',
      'be6f75c05',
      'ae0e02f22',
      '362372eb4',
      '4114e2447',
      'b50820152',
    ]);
    expect(harvest.reviewThreads).toHaveLength(17);
    expect(harvest.reviews).toHaveLength(26);
    expect(harvest.comments).toHaveLength(10);
  });

  it('binds each thread to its originating review commit through its first comment', () => {
    const harvest = parseRecordedHarvest(pr135);
    const bindings = new Set(
      harvest.reviewThreads.map((thread) => thread.reviewCommitOid?.slice(0, 9) ?? 'unbound'),
    );
    expect(bindings).toStrictEqual(
      new Set(['362372eb4', '4114e2447', 'ae0e02f22', 'b50820152', 'be6f75c05']),
    );
  });

  it('refuses a truncated recording: a page with hasNextPage true is not a fixture', () => {
    const truncated = {
      ...pr135,
      reviews: { ...pr135.reviews, pageInfo: { hasNextPage: true, endCursor: 'Y3Vyc29y' } },
    };
    expect(() => parseRecordedHarvest(truncated)).toThrow(/truncated/u);
  });

  it('fails loud on a malformed shape rather than degrading to an empty harvest', () => {
    expect(() => parseRecordedHarvest({ number: 1 })).toThrow();
    expect(() => parseRecordedHarvest('not a harvest')).toThrow();
  });
});
