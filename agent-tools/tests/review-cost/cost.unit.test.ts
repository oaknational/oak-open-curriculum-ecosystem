import { describe, expect, it } from 'vitest';

import { DEFAULT_POLICY, reviewCost, roundCost } from '../../src/review-cost/cost.js';
import type { RoundMeasure } from '../../src/review-cost/cost.js';

const measure = (overrides: Partial<RoundMeasure> & { head: string }): RoundMeasure => ({
  findings: 0,
  commentChars: 0,
  pushLines: 0,
  pushFiles: 0,
  relatedness: 0,
  hoursSincePrevious: null,
  sync: false,
  ...overrides,
});

// The shape of PR #139's first three rounds, 2026-09-12: ten, nine and six
// findings, pushes of a few hundred lines to the same files within the hour.
const PR_139_LIKE: RoundMeasure[] = [
  measure({ head: 'r1', findings: 10, commentChars: 9000, pushLines: 900, pushFiles: 12 }),
  measure({
    head: 'r2',
    findings: 9,
    commentChars: 8000,
    pushLines: 250,
    pushFiles: 6,
    relatedness: 0.8,
    hoursSincePrevious: 0.4,
  }),
  measure({
    head: 'r3',
    findings: 6,
    commentChars: 6000,
    pushLines: 200,
    pushFiles: 5,
    relatedness: 0.9,
    hoursSincePrevious: 0.5,
  }),
];

describe('roundCost — every driver raises the cost, deterministically', () => {
  it('prices an empty round at the round floor: a round costs a review run and a pass even with nothing raised', () => {
    expect(roundCost(measure({ head: 'h' }), DEFAULT_POLICY)).toBe(DEFAULT_POLICY.baseRound);
  });

  it('prices findings, comment volume, push size and file spread additively', () => {
    const cost = roundCost(
      measure({ head: 'h', findings: 4, commentChars: 3000, pushLines: 150, pushFiles: 5 }),
      DEFAULT_POLICY,
    );
    expect(cost).toBe(DEFAULT_POLICY.baseRound + 2 + 0.6 + 0.45 + 0.5);
  });

  it('multiplies by relatedness: a push to the same files costs more', () => {
    const base = measure({ head: 'h', findings: 4 });
    expect(roundCost({ ...base, relatedness: 1 }, DEFAULT_POLICY)).toBe(
      2 * roundCost(base, DEFAULT_POLICY),
    );
  });

  it('multiplies by reactivity: a push within the hour costs more, one after it does not', () => {
    const base = measure({ head: 'h', findings: 4 });
    expect(roundCost({ ...base, hoursSincePrevious: 0 }, DEFAULT_POLICY)).toBe(
      2 * roundCost(base, DEFAULT_POLICY),
    );
    expect(roundCost({ ...base, hoursSincePrevious: 3 }, DEFAULT_POLICY)).toBe(
      roundCost(base, DEFAULT_POLICY),
    );
  });
});

describe('reviewCost — the opening round is priced, never charged; settlement rounds accrue against the pushes', () => {
  it('reads a large opening round with no settlement push as within budget', () => {
    const report = reviewCost(
      [measure({ head: 'r1', findings: 12, commentChars: 9000, pushLines: 900, pushFiles: 12 })],
      2,
    );
    expect(report.verdict).toBe('within');
    expect(report.total).toBe(0);
    expect(report.budget).toBe(40);
  });

  it('warns past half the budget', () => {
    const report = reviewCost(
      [
        measure({ head: 'r1', findings: 6, commentChars: 4000, pushLines: 300, pushFiles: 6 }),
        measure({
          head: 'r2',
          findings: 10,
          commentChars: 6000,
          pushLines: 300,
          pushFiles: 6,
          relatedness: 1,
          hoursSincePrevious: 4,
        }),
      ],
      2,
    );
    expect(report.verdict).toBe('warn');
  });

  it('reads the shape of PR #139 as exhausted after its second settlement round', () => {
    const report = reviewCost(PR_139_LIKE, 2);
    expect(report.total).toBeGreaterThan(report.budget);
    expect(report.verdict).toBe('exhausted');
    expect(report.evidence.some((line) => line.startsWith('BUDGET-EXHAUSTED'))).toBe(true);
  });

  it('would have allowed the second push and refused the third', () => {
    expect(reviewCost(PR_139_LIKE.slice(0, 2), 2).verdict).not.toBe('exhausted');
    expect(reviewCost(PR_139_LIKE.slice(0, 3), 2).verdict).toBe('exhausted');
  });

  it('grants one converging extension when the crossing round costs no more than half the one before', () => {
    const rounds = [
      measure({ head: 'r1', findings: 12, commentChars: 9000, pushLines: 900, pushFiles: 12 }),
      measure({
        head: 'r2',
        findings: 20,
        commentChars: 9000,
        pushLines: 400,
        pushFiles: 6,
        hoursSincePrevious: 2,
      }),
      measure({
        head: 'r3',
        findings: 2,
        commentChars: 500,
        pushLines: 20,
        pushFiles: 1,
        hoursSincePrevious: 2,
      }),
    ];
    const report = reviewCost(rounds, 1);
    expect(report.total).toBeGreaterThan(report.budget);
    expect(report.verdict).toBe('converging');
    // The extension is one round: crossing earlier and then halving again is exhausted.
    const later = [
      ...rounds,
      measure({ head: 'r4', findings: 1, pushLines: 10, pushFiles: 1, hoursSincePrevious: 2 }),
    ];
    expect(reviewCost(later, 1).verdict).toBe('exhausted');
  });

  it('lets the first settlement round earn the extension against the opening round as its baseline', () => {
    const report = reviewCost(
      [
        measure({ head: 'r1', findings: 60, commentChars: 40000, pushLines: 3000, pushFiles: 40 }),
        measure({
          head: 'r2',
          findings: 30,
          commentChars: 20000,
          pushLines: 600,
          pushFiles: 10,
          hoursSincePrevious: 3,
        }),
      ],
      1,
    );
    expect(report.total).toBeGreaterThan(report.budget);
    expect(report.verdict).toBe('converging');
  });

  it('exhausts a long loop of small rounds through the round floor alone', () => {
    const small = (head: string) =>
      measure({
        head,
        findings: 2,
        commentChars: 800,
        pushLines: 30,
        pushFiles: 2,
        relatedness: 0.5,
        hoursSincePrevious: 0.5,
      });
    const rounds = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].map(small);
    expect(reviewCost(rounds.slice(0, 4), 2).verdict).not.toBe('exhausted');
    expect(reviewCost(rounds, 2).verdict).toBe('exhausted');
  });

  it('accrues nothing for a reviewed sync round, whatever it raised', () => {
    const rounds = [
      measure({ head: 'r1', findings: 6, commentChars: 4000, pushLines: 300, pushFiles: 6 }),
      measure({
        head: 'sync',
        findings: 6,
        commentChars: 5000,
        pushLines: 0,
        pushFiles: 0,
        hoursSincePrevious: 0.1,
        sync: true,
      }),
    ];
    const report = reviewCost(rounds, 2);
    expect(report.total).toBe(0);
    expect(report.rounds[1]?.cost).toBe(0);
    expect(report.verdict).toBe('within');
  });

  it('grants the converging push once: with the head already advanced past the last reviewed round it is exhausted', () => {
    const rounds = [
      measure({ head: 'r1', findings: 12, commentChars: 9000, pushLines: 900, pushFiles: 12 }),
      measure({
        head: 'r2',
        findings: 20,
        commentChars: 9000,
        pushLines: 400,
        pushFiles: 6,
        hoursSincePrevious: 2,
      }),
      measure({
        head: 'r3',
        findings: 2,
        commentChars: 500,
        pushLines: 20,
        pushFiles: 1,
        hoursSincePrevious: 2,
      }),
    ];
    expect(reviewCost(rounds, 1).verdict).toBe('converging');
    const taken = reviewCost(rounds, 1, undefined, { headAdvanced: true });
    expect(taken.verdict).toBe('exhausted');
    expect(taken.evidence.some((line) => line.includes('converging push has been taken'))).toBe(
      true,
    );
  });

  it('scales the budget with the declared pushes', () => {
    expect(reviewCost([], 2).budget).toBe(40);
    expect(reviewCost([], 4).budget).toBe(80);
  });
});

describe('pushesPastBudget — the rounds reviewed after the one that crossed the budget', () => {
  it('is zero while the budget holds and zero on the crossing round itself', () => {
    expect(reviewCost(PR_139_LIKE.slice(0, 2), 2).pushesPastBudget).toBe(0);
    expect(reviewCost(PR_139_LIKE.slice(0, 3), 2).pushesPastBudget).toBe(0);
  });

  it('counts each reviewed round after the crossing', () => {
    const later = [...PR_139_LIKE, measure({ head: 'r4', findings: 3, commentChars: 2000 })];
    expect(reviewCost(later, 2).pushesPastBudget).toBe(1);
  });
});
