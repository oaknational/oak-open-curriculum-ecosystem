/**
 * The stdout summaries are the adjudicating reader's first evidence, so
 * their honesty obligations are pinned here: pre-crop height facts
 * surface FIRST (above every statistic line) whenever the comparison is
 * partial — a truncated tail (uncompared content absent from every
 * written PNG) and, on the calibrated arm, settle variance (repeat
 * heights differ, inflating the pooled null so verdicts read
 * CONSERVATIVE) are two different diseases and get two different lines.
 * The correlation-line wiring cells ride along (the estimator contracts
 * are proven in the library's own suite).
 */
import type { PairAnalysis } from '@oaknational/fidelity-review/visual-stats';
import type { CalibratedPairAnalysis } from '@oaknational/fidelity-review/visual-calibration';
import { describe, expect, it } from 'vitest';

import { summariseCalibrated, summariseNaive } from './capture-summary';

function naiveFixture(height: number): PairAnalysis {
  return {
    width: 32,
    height,
    sigma0: 0.5,
    windowSize: 32,
    threshold: 6,
    scores: [],
    rejecting: [],
  };
}

function calibratedFixture(
  correlation: CalibratedPairAnalysis['calibration']['correlation'],
  height = 32,
): CalibratedPairAnalysis {
  return {
    width: 32,
    height,
    sigma0: 0.5,
    windowSize: 32,
    threshold: 6,
    scores: [],
    rejecting: [],
    calibratedRejecting: [],
    calibration: {
      n: 3,
      nullMax: 0.5,
      floor: 0.25,
      sigmaSaturation: 0.674,
      tailOrderStats: [0.5, 0.4, 0.3],
      quantiles: { p50: 0.4, p90: 0.5, p99: 0.5 },
      ...(correlation ? { correlation } : {}),
    },
  };
}

describe('summariseNaive — height honesty', () => {
  it('leads with the statistics when the captures matched heights', () => {
    const summary = summariseNaive({
      analysis: naiveFixture(1280),
      leftHeights: [1280],
      rightHeight: 1280,
    });
    expect(summary.split('\n')[0]).toMatch(/^sigma0=/);
    expect(summary).not.toContain('height mismatch');
  });

  it('puts the truncated-tail caveat FIRST when heights differ', () => {
    const summary = summariseNaive({
      analysis: naiveFixture(1280),
      leftHeights: [1664],
      rightHeight: 1280,
    });
    const first = summary.split('\n')[0] ?? '';
    expect(first).toContain('height mismatch: left=1664px right=1280px');
    expect(first).toContain('content below 1280px is not compared');
    expect(first).toContain('absent from every written PNG');
    expect(summary).toContain('sigma0=');
  });

  it('names the compared height, not the right height, when the rebuild is taller', () => {
    const summary = summariseNaive({
      analysis: naiveFixture(1216),
      leftHeights: [1216],
      rightHeight: 1400,
    });
    const first = summary.split('\n')[0] ?? '';
    expect(first).toContain('height mismatch: left=1216px right=1400px');
    expect(first).toContain('content below 1216px is not compared');
  });
});

describe('summariseCalibrated — height honesty', () => {
  it('leads with the calibrated line when every capture height matched', () => {
    const summary = summariseCalibrated({
      analysis: calibratedFixture(undefined),
      leftHeights: [32, 32, 32],
      rightHeight: 32,
    });
    expect(summary.split('\n')[0]).toMatch(/^calibrated:/);
    expect(summary).not.toContain('height mismatch');
    expect(summary).not.toContain('settle variance');
  });

  it('names settle variance alone when only the left repeats disagree', () => {
    const summary = summariseCalibrated({
      analysis: calibratedFixture(undefined, 1284),
      leftHeights: [1284, 1300, 1300],
      rightHeight: 1284,
    });
    const first = summary.split('\n')[0] ?? '';
    expect(first).toContain(
      'settle variance: left capture heights vary (1284–1300px across 3 repeats)',
    );
    expect(first).toContain('pooled null is inflated');
    expect(first).toContain('CONSERVATIVE');
    expect(summary).not.toContain('height mismatch');
  });

  it('names the truncated tail alone when left and right disagree', () => {
    const summary = summariseCalibrated({
      analysis: calibratedFixture(undefined, 1216),
      leftHeights: [1300, 1300],
      rightHeight: 1216,
    });
    const first = summary.split('\n')[0] ?? '';
    expect(first).toContain('height mismatch: left=1300px right=1216px');
    expect(first).toContain('content below 1216px is not compared');
    expect(summary).not.toContain('settle variance');
  });
});

describe('summariseCalibrated — caveat ordering', () => {
  it('stacks both caveats above the statistics when both diseases are present', () => {
    const summary = summariseCalibrated({
      analysis: calibratedFixture(undefined, 1216),
      leftHeights: [1284, 1300],
      rightHeight: 1216,
    });
    const lines = summary.split('\n');
    expect(lines[0] ?? '').toContain('settle variance');
    expect(lines[1] ?? '').toContain('height mismatch: left=1284px right=1216px');
    expect(lines[2] ?? '').toMatch(/^calibrated:/);
  });
});

describe('summariseCalibrated — correlation line wiring', () => {
  it('prints the diagnostic line when the calibration carries one', () => {
    const summary = summariseCalibrated({
      analysis: calibratedFixture({
        kind: 'estimated',
        lag1Row: 0.62,
        lag1Col: 0.58,
        nEff: { kind: 'estimated', value: 0.062 },
        pairCount: 3,
        estimablePairCount: 3,
        captureCount: 3,
      }),
      leftHeights: [32, 32, 32],
      rightHeight: 32,
    });
    expect(summary).toContain('null correlation (diagnostic only)');
  });

  it('omits the line only when no diagnostics were computed at all', () => {
    const summary = summariseCalibrated({
      analysis: calibratedFixture(undefined),
      leftHeights: [32, 32, 32],
      rightHeight: 32,
    });
    expect(summary).not.toContain('null correlation');
  });
});
