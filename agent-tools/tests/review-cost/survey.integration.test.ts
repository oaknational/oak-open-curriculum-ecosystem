import { describe, expect, it } from 'vitest';

import type { CostReport } from '../../src/review-cost/cost.js';
import type { ListedPullRequest } from '../../src/review-cost/harvest.js';
import { runSurvey } from '../../src/review-cost/survey.js';

// Both seams are injected: no gh, no git. One pull request prices; the other
// is one this checkout could not hold, and the survey must still finish.
const LISTED: ListedPullRequest[] = [
  { number: 141, state: 'MERGED', title: 'the gate', mergedAt: '2026-09-12T23:16:00Z' },
  { number: 90, state: 'CLOSED', title: 'a fork branch', mergedAt: null },
];

const REPORT: CostReport = {
  rounds: [
    { head: '19071d597aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', cost: 10.62 },
    { head: 'be393ad02bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', cost: 16.95 },
  ],
  total: 16.95,
  budget: 40,
  budgetPushes: 2,
  verdict: 'within',
  pushesPastBudget: 0,
  evidence: [],
};

const survey = (json: boolean) => {
  const out: string[] = [];
  const exitCode = runSurvey({
    since: '2026-09-12',
    repo: 'EngraphCode/open-curriculum-ecosystem',
    expectedReviewers: [],
    json,
    stdout: {
      write: (chunk: string) => {
        out.push(chunk);
        return true;
      },
    },
    list: () => LISTED,
    price: ({ number }) => {
      if (number === 90) {
        throw new Error('fatal: bad object deadbeef');
      }
      return REPORT;
    },
  });
  return { exitCode, text: out.join('') };
};

describe('runSurvey — one line per pull request, priced as the gate prices it', () => {
  it('prints the table with a priced row and an unpriceable row, and exits 0', () => {
    const { exitCode, text } = survey(false);
    expect(exitCode).toBe(0);
    const lines = text.trim().split('\n');
    expect(lines[0]).toBe(
      '| PR | state | rounds | settlement cost | budget | verdict | round costs |',
    );
    expect(lines[2]).toBe(
      '| #141 | MERGED | 2 | 16.95 | 40 (2 pushes) | within | 19071d597 10.62, be393ad02 16.95 |',
    );
    expect(lines[3]).toBe(
      '| #90 | CLOSED | — | — | — | unpriceable | fatal: bad object deadbeef |',
    );
  });

  it('emits the same rows as JSON: the report on a priced row, the error on an unpriced one', () => {
    const { exitCode, text } = survey(true);
    expect(exitCode).toBe(0);
    const rows: unknown = JSON.parse(text);
    expect(rows).toStrictEqual([
      { ...LISTED[0], report: REPORT },
      { ...LISTED[1], error: 'fatal: bad object deadbeef' },
    ]);
  });
});
