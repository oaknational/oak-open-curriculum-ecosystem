import { describe, expect, it } from 'vitest';

import { parseRecordedHarvest } from '../../src/pr-tally/harvest.js';
import { reviewCost } from '../../src/review-cost/cost.js';
import { measureRounds } from '../../src/review-cost/measure.js';
import type { DiffStat } from '../../src/review-cost/measure.js';
import pr138 from '../pr-tally/fixtures/pr-138-harvest.json' with { type: 'json' };

const EXPECTED = ['copilot-pull-request-reviewer', 'chatgpt-codex-connector'];

// A recording carries no diffs; the reader is injected. Each push here is a
// modest edit to the same two files, the fix-push signature.
const sameFiles: DiffStat = { lines: 120, files: ['a.ts', 'b.ts'], sync: false };

const short = (oid: string) => oid.slice(0, 9);
const hours = (value: number | null) => (value === null ? null : Math.round(value * 100) / 100);

describe('measureRounds — one measure per reviewed head of the #138 recording', () => {
  it('measures the seven reviewed heads exactly, in branch order, each push from the head before', () => {
    const harvest = parseRecordedHarvest(pr138);
    const calls: string[] = [];
    const rounds = measureRounds({
      harvest,
      expectedReviewers: EXPECTED,
      baseRef: 'origin/engraph',
      diff: (from, to) => {
        calls.push(`${short(from)}..${short(to)}`);
        return sameFiles;
      },
    });
    expect(
      rounds.map((round) => [
        short(round.head),
        round.findings,
        round.commentChars,
        round.pushLines,
        round.pushFiles,
        round.relatedness,
        hours(round.hoursSincePrevious),
      ]),
    ).toStrictEqual([
      ['352ad0ee5', 7, 9345, 120, 2, 0, null],
      ['84dd6291b', 11, 10273, 120, 2, 1, 0.28],
      ['db67da4d5', 10, 9648, 120, 2, 1, 0.19],
      ['a1ec078e2', 9, 10247, 120, 2, 1, 0.32],
      ['33cca25bc', 5, 6267, 120, 2, 1, 0.24],
      ['ebf90ac3b', 3, 3685, 120, 2, 1, 0.27],
      ['fe81ac086', 3, 4147, 120, 2, 1, 0.22],
    ]);
    expect(calls).toStrictEqual([
      'origin/en..352ad0ee5',
      '352ad0ee5..84dd6291b',
      '84dd6291b..db67da4d5',
      'db67da4d5..a1ec078e2',
      'a1ec078e2..33cca25bc',
      '33cca25bc..ebf90ac3b',
      'ebf90ac3b..fe81ac086',
    ]);
  });

  it('creates no round for a head whose only review from a declared reviewer is a skip marker', () => {
    const harvest = parseRecordedHarvest(pr138);
    const unreviewed = harvest.commits.find(
      (commit) => !harvest.reviews.some((review) => review.commitOid === commit.oid),
    );
    expect(unreviewed, 'fixture has no unreviewed head').toBeDefined();
    const skip = {
      id: 'PRR_skip',
      databaseId: 9000001,
      author: EXPECTED[0] ?? '',
      state: 'COMMENTED',
      commitOid: unreviewed?.oid ?? '',
      submittedAt: '2026-09-12T16:00:00Z',
      body: 'Unable to review: service unavailable.',
    };
    const before = measureRounds({
      harvest,
      expectedReviewers: EXPECTED,
      baseRef: 'origin/engraph',
      diff: () => sameFiles,
    });
    const after = measureRounds({
      harvest: { ...harvest, reviews: [...harvest.reviews, skip] },
      expectedReviewers: EXPECTED,
      baseRef: 'origin/engraph',
      diff: () => sameFiles,
    });
    expect(after.map((round) => round.head)).toStrictEqual(before.map((round) => round.head));
  });

  it('adds no findings and no characters for a PENDING draft on an otherwise reviewed head', () => {
    const harvest = parseRecordedHarvest(pr138);
    const head = harvest.commits[0]?.oid ?? '';
    const draft = {
      id: 'PRR_draft',
      databaseId: 9000002,
      author: EXPECTED[0] ?? '',
      state: 'PENDING',
      commitOid: head,
      submittedAt: '',
      body: '### Suppressed comments (1)\n\n**docs/a.md:1**\n* A draft finding with a long body.\n',
    };
    const measure = (reviews: typeof harvest.reviews) =>
      measureRounds({
        harvest: { ...harvest, reviews },
        expectedReviewers: EXPECTED,
        baseRef: 'origin/engraph',
        diff: () => sameFiles,
      })[0];
    const before = measure(harvest.reviews);
    const after = measure([...harvest.reviews, draft]);
    expect(after?.findings).toBe(before?.findings);
    expect(after?.commentChars).toBe(before?.commentChars);
  });

  it('reads the #138 loop — six settlement rounds of fix-pushes — as exhausted against a budget of two', () => {
    const harvest = parseRecordedHarvest(pr138);
    const rounds = measureRounds({
      harvest,
      expectedReviewers: EXPECTED,
      baseRef: 'origin/engraph',
      diff: () => sameFiles,
    });
    expect(reviewCost(rounds, 2).verdict).toBe('exhausted');
  });
});
