import { describe, expect, it } from 'vitest';

import { computeMetadata } from './compute.js';

describe('computeMetadata', () => {
  it('computes remaining tokens and one-decimal percentages', () => {
    expect(computeMetadata({ usedTokens: 372_025, windowTokens: 1_000_000 })).toStrictEqual({
      usedTokens: 372_025,
      windowTokens: 1_000_000,
      remainingTokens: 627_975,
      pctUsed: 37.2,
      pctRemaining: 62.8,
      zone: 'healthy',
      advice: 'full capacity; carry on; directive edits wait for the next compaction',
    });
  });

  it('adds the directive-edit deferral to the advice from 30% (PDR-052)', () => {
    const below = computeMetadata({ usedTokens: 299_000, windowTokens: 1_000_000 });
    const at = computeMetadata({ usedTokens: 300_000, windowTokens: 1_000_000 });

    expect(at.zone).toBe(below.zone);
    expect(at.advice).toBe(`${below.advice}; directive edits wait for the next compaction`);
  });

  it('judges the 30% floor on the unrounded figure, not the one-decimal report', () => {
    const below = computeMetadata({ usedTokens: 299_000, windowTokens: 1_000_000 });
    const justBelow = computeMetadata({ usedTokens: 299_950, windowTokens: 1_000_000 });

    expect(justBelow.pctUsed).toBe(30);
    expect(justBelow.advice).toBe(below.advice);
  });

  it('rounds percentages to one decimal', () => {
    const result = computeMetadata({ usedTokens: 333_333, windowTokens: 1_000_000 });

    expect(result.pctUsed).toBe(33.3);
    expect(result.pctRemaining).toBe(66.7);
  });

  it('floors remaining tokens and remaining percentage at zero when occupancy exceeds the window', () => {
    const result = computeMetadata({ usedTokens: 250_000, windowTokens: 200_000 });

    expect(result.remainingTokens).toBe(0);
    expect(result.pctUsed).toBe(125);
    expect(result.pctRemaining).toBe(0);
    expect(result.zone).toBe('degraded');
  });

  it.each([
    { usedTokens: 100_000, zone: 'healthy' },
    { usedTokens: 420_000, zone: 'peak' },
    { usedTokens: 550_000, zone: 'past-peak' },
    { usedTokens: 700_000, zone: 'mistake-prone' },
    { usedTokens: 850_000, zone: 'degraded' },
    // Band boundaries (the < cutoffs) — guard off-by-one drift.
    { usedTokens: 400_000, zone: 'peak' },
    { usedTokens: 500_000, zone: 'past-peak' },
    { usedTokens: 650_000, zone: 'mistake-prone' },
    { usedTokens: 800_000, zone: 'degraded' },
  ])('maps $usedTokens/1M onto the $zone effectiveness zone', ({ usedTokens, zone }) => {
    expect(computeMetadata({ usedTokens, windowTokens: 1_000_000 }).zone).toBe(zone);
  });
});
