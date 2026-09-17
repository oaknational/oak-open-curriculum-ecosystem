/**
 * The calibration contract: exact continuity-corrected p with ties
 * counting against rejection, an honest σ that saturates at the null's
 * resolution, full-windows-only calibration, and the discriminating
 * behaviour the whole slice exists for — a pair whose differences sit
 * WITHIN same-page jitter rejects under the naive z (σ₀ floors at 0.5,
 * so a uniform 0.2-luma field scores z ≈ 12.8 per 32×32 window) and
 * yields ZERO rejections under calibration. Deterministic throughout:
 * the distribution cells drive a seeded LCG, never Math.random.
 */
import { describe, expect, it } from 'vitest';

import { inverseNormalCdf } from './inverse-normal-cdf.js';
import { analysePair } from './visual-stats.js';
import {
  calibrateAnalysis,
  renderCalibratedHeatmap,
  TAIL_ORDER_STATS,
} from './visual-calibration.js';

/** Seeded LCG (Numerical Recipes constants) — deterministic test noise. */
function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 2 ** 32;
  };
}

/** A width×height RGBA buffer with every pixel at the given grey level. */
function greyImage(width: number, height: number, level: number): Uint8Array {
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    rgba[i * 4] = level;
    rgba[i * 4 + 1] = level;
    rgba[i * 4 + 2] = level;
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

/** A grey image whose left half sits at base+leftDelta and right half at
 *  base+rightDelta — two windows, two magnitudes. */
function twoBandImage(
  width: number,
  height: number,
  base: number,
  leftDelta: number,
  rightDelta: number,
): Uint8Array {
  const rgba = greyImage(width, height, base);
  for (let i = 0; i < width * height; i += 1) {
    const level = base + (i % width < width / 2 ? leftDelta : rightDelta);
    rgba[i * 4] = level;
    rgba[i * 4 + 1] = level;
    rgba[i * 4 + 2] = level;
  }
  return rgba;
}

describe('calibrateAnalysis — the exact rank contract', () => {
  // A 32×32 single-window pair with a uniform 2-level difference gives
  // one full window with meanAbsDiff = 2 to rank against a chosen null.
  function analysisWithMeanDiff(level: number) {
    const a = greyImage(32, 32, 100);
    const b = greyImage(32, 32, 100 + level);
    const analysis = analysePair(a, b, 32, 32);
    expect(analysis.ok).toBe(true);
    return analysis.ok ? analysis.value : undefined;
  }

  it('computes the continuity-corrected p with ties counting against rejection', () => {
    const analysis = analysisWithMeanDiff(2);
    expect(analysis).toBeDefined();
    if (analysis === undefined) {
      return;
    }
    // Null [1, 2, 3]: #{null ≥ 2} = 2 (the tie counts), p = (1+2)/(3+1).
    const calibrated = calibrateAnalysis(analysis, [1, 2, 3]);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    expect(calibrated.value.scores[0]?.empiricalP).toBeCloseTo(3 / 4, 12);
    // At or below the null max is NOT a rejection.
    expect(calibrated.value.calibratedRejecting).toHaveLength(0);
  });

  it('rejects beyond the null maximum, ordered by exceedance, with the floor stated', () => {
    const analysis = analysisWithMeanDiff(10);
    expect(analysis).toBeDefined();
    if (analysis === undefined) {
      return;
    }
    const nullScores = [0.1, 0.2, 0.3, 0.4, 0.5];
    const calibrated = calibrateAnalysis(analysis, nullScores);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    expect(calibrated.value.calibratedRejecting).toHaveLength(1);
    expect(calibrated.value.calibratedRejecting[0]?.exceedance).toBeCloseTo(10 / 0.5, 9);
    expect(calibrated.value.calibration.floor).toBeCloseTo(1 / 6, 12);
    expect(calibrated.value.calibration.nullMax).toBeCloseTo(0.5, 12);
  });

  it('saturates calibratedSigma at the null resolution and says where', () => {
    const analysis = analysisWithMeanDiff(10);
    expect(analysis).toBeDefined();
    if (analysis === undefined) {
      return;
    }
    const nullScores = Array.from({ length: 999 }, (_, i) => i / 1000);
    const calibrated = calibrateAnalysis(analysis, nullScores);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    const saturation = inverseNormalCdf(999 / 1000);
    expect(saturation.ok).toBe(true);
    if (!saturation.ok) {
      return;
    }
    expect(calibrated.value.calibration.sigmaSaturation).toBeCloseTo(saturation.value, 9);
    // A window far beyond every null score sits AT the saturation: its p
    // is the floor, so its σ equals Φ⁻¹(1 − floor) exactly.
    expect(calibrated.value.calibratedRejecting[0]?.calibratedSigma).toBeCloseTo(
      saturation.value,
      9,
    );
    expect(calibrated.value.calibration.tailOrderStats.length).toBeLessThanOrEqual(
      TAIL_ORDER_STATS,
    );
  });

  it('saturates a completely quiet window at the LOW end, never the high end', () => {
    // p = 1 (at or below every null score) has true σ of −∞: it mirrors
    // the high-end cap at −saturation. The defect class under guard:
    // the first live run stamped +saturation on every quiet window.
    const a = greyImage(32, 32, 100);
    const b = greyImage(32, 32, 100);
    const analysis = analysePair(a, b, 32, 32);
    expect(analysis.ok).toBe(true);
    if (!analysis.ok) {
      return;
    }
    const calibrated = calibrateAnalysis(analysis.value, [1, 2, 3]);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    const quiet = calibrated.value.scores[0];
    expect(quiet?.empiricalP).toBeCloseTo(1, 12);
    expect(quiet?.calibratedSigma).toBeCloseTo(-calibrated.value.calibration.sigmaSaturation, 12);
  });

  it('marks partial windows uncalibrated instead of pooling them silently', () => {
    // 32×40 at window 32: one full window and one 32×8 partial below it.
    const a = greyImage(32, 40, 100);
    const b = greyImage(32, 40, 110);
    const analysis = analysePair(a, b, 32, 40);
    expect(analysis.ok).toBe(true);
    if (!analysis.ok) {
      return;
    }
    const calibrated = calibrateAnalysis(analysis.value, [0.1, 0.2]);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    const partial = calibrated.value.scores.find((s) => s.n !== 32 * 32);
    expect(partial?.uncalibrated).toBe('partial-window');
    expect(partial?.empiricalP).toBeUndefined();
    const full = calibrated.value.scores.find((s) => s.n === 32 * 32);
    expect(full?.empiricalP).toBeDefined();
  });

  it('refuses an empty null', () => {
    const analysis = analysisWithMeanDiff(2);
    expect(analysis).toBeDefined();
    if (analysis === undefined) {
      return;
    }
    expect(calibrateAnalysis(analysis, []).ok).toBe(false);
  });
});

describe('the degenerate null — byte-stable repeat captures', () => {
  it('rejects any nonzero window with no exceedance ratio, ordered by magnitude', () => {
    // The estate settle recipe makes a deterministic page's repeat
    // captures byte-identical (observed on the first live run:
    // nullMax = 0) — the honest verdict is then that ANY difference
    // rejects, and no finite exceedance ratio exists to report.
    const a = greyImage(32, 32, 100);
    const b = greyImage(32, 32, 103);
    const analysis = analysePair(a, b, 32, 32);
    expect(analysis.ok).toBe(true);
    if (!analysis.ok) {
      return;
    }
    const calibrated = calibrateAnalysis(analysis.value, [0, 0, 0]);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    expect(calibrated.value.calibratedRejecting).toHaveLength(1);
    expect(calibrated.value.calibratedRejecting[0]?.exceedance).toBeUndefined();
    // JSON round-trip stays lossless: no Infinity to silently null.
    const roundTrip: unknown = JSON.parse(JSON.stringify(calibrated.value));
    expect(JSON.stringify(roundTrip)).toBe(JSON.stringify(calibrated.value));
  });

  it('orders degenerate-null rejections by magnitude and full-flags them in the heatmap', () => {
    // Two windows, different magnitudes: left half Δ3, right half Δ8.
    const width = 64;
    const a = greyImage(width, 32, 100);
    const b = twoBandImage(width, 32, 100, 3, 8);
    const analysis = analysePair(a, b, width, 32);
    expect(analysis.ok).toBe(true);
    if (!analysis.ok) {
      return;
    }
    const calibrated = calibrateAnalysis(analysis.value, [0, 0, 0]);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    // Magnitude ordering: the Δ8 window leads (no exceedance to sort by).
    expect(calibrated.value.calibratedRejecting).toHaveLength(2);
    expect(calibrated.value.calibratedRejecting[0]?.meanAbsDiff).toBeCloseTo(8, 9);
    expect(calibrated.value.calibratedRejecting[1]?.meanAbsDiff).toBeCloseTo(3, 9);
    // Full-flag heatmap: a degenerate rejection tints at strength 1
    // (red channel saturates), and the base buffer stays untouched.
    const heatmap = renderCalibratedHeatmap(a, width, calibrated.value);
    expect(heatmap[0]).toBe(255);
    expect(a[0]).toBe(100);
  });
});

describe('the diagnostic never corrects the rank', () => {
  it('yields identical calibration with and without correlation diagnostics supplied', () => {
    // The load-bearing invariant behind "never a second correction":
    // an implementation that fed n_eff into the rank would diverge
    // here; carrying the block verbatim is the only permitted effect.
    const a = greyImage(32, 32, 100);
    const b = greyImage(32, 32, 110);
    const analysis = analysePair(a, b, 32, 32);
    expect(analysis.ok).toBe(true);
    if (!analysis.ok) {
      return;
    }
    const nullScores = [0.1, 0.2, 0.3, 0.4, 0.5];
    const correlation = {
      kind: 'estimated',
      lag1Row: 0.5,
      lag1Col: 0.5,
      nEff: { kind: 'estimated', value: 1 / 9 },
      pairCount: 3,
      estimablePairCount: 3,
      captureCount: 3,
    } as const;
    const withBlock = calibrateAnalysis(analysis.value, nullScores, { correlation });
    const withoutBlock = calibrateAnalysis(analysis.value, nullScores);
    expect(withBlock.ok && withoutBlock.ok).toBe(true);
    if (!withBlock.ok || !withoutBlock.ok) {
      return;
    }
    expect(withBlock.value.scores).toEqual(withoutBlock.value.scores);
    expect(withBlock.value.calibratedRejecting).toEqual(withoutBlock.value.calibratedRejecting);
    expect(withBlock.value.rejecting).toEqual(withoutBlock.value.rejecting);
    const { correlation: carried, ...restWith } = withBlock.value.calibration;
    expect(carried).toEqual(correlation);
    expect(restWith).toEqual(withoutBlock.value.calibration);
  });
});

describe('the discriminating behaviour — within-null jitter', () => {
  it('a pair inside same-page jitter rejects naively and not at all under calibration', () => {
    // A uniform 1-level difference over 64×64: every 32×32 window scores
    // meanAbsDiff = 1, z = 1/(0.5/32) = 64 — far beyond the naive 6σ
    // (the σ₀ MAD floor makes tiny uniform fields scream). A same-page
    // null whose windows jitter at or above 1 level says: trivial.
    const a = greyImage(64, 64, 100);
    const b = greyImage(64, 64, 101);
    const analysis = analysePair(a, b, 64, 64);
    expect(analysis.ok).toBe(true);
    if (!analysis.ok) {
      return;
    }
    expect(analysis.value.rejecting.length).toBeGreaterThan(0);
    const random = lcg(7);
    const nullScores = Array.from({ length: 400 }, () => 0.8 + random() * 0.6);
    const calibrated = calibrateAnalysis(analysis.value, nullScores);
    expect(calibrated.ok).toBe(true);
    if (!calibrated.ok) {
      return;
    }
    expect(calibrated.value.calibratedRejecting).toHaveLength(0);
  });
});
