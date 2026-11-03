import { describe, expect, it } from 'vitest';

import { countRebudgets, readBudget } from '../../src/review-cost/budget.js';

describe('readBudget — the declared settlement-push budget from the description', () => {
  it('reads the template intake line with an em dash', () => {
    expect(readBudget('bar — PDR-140 clause 9; budget — 2 settlement pushes.')).toStrictEqual({
      pushes: 2,
      declared: true,
    });
  });

  it('reads a colon form and a longer budget', () => {
    expect(readBudget('Settlement-push budget: 3 (owner rebudget)').pushes).toBe(3);
  });

  it('defaults to two when no line declares it', () => {
    expect(readBudget('A description with no intake.')).toStrictEqual({
      pushes: 2,
      declared: false,
    });
  });
});

describe('countRebudgets — the decision lines of the local note for one pull request', () => {
  const note = [
    '340 — 2026-10-24 — the comms-log cure and the gate cure ride one push',
    '12: 2026-10-20: a late over-bar cure',
    '340 - 2026-10-25 - the one late cure after the rebudget',
    'rebudget 340 with no date is not a decision line',
    '',
  ].join('\n');

  it('counts the dated lines of the pull request, whatever dash they use', () => {
    expect(countRebudgets(note, 340)).toBe(2);
    expect(countRebudgets(note, 12)).toBe(1);
  });

  it('counts nothing for a pull request the note does not name, and nothing in an empty note', () => {
    expect(countRebudgets(note, 7)).toBe(0);
    expect(countRebudgets('', 340)).toBe(0);
  });
});
