/**
 * The correlation-diagnostics contract (S2b): exact lag-1 readings on
 * analytic constructions (non-square, so a row/col swap bites on
 * magnitude AND sign), a domain-gated effective-sample ratio that
 * refuses the AR(1) label outside its model, an exact constant-field
 * guard that catches float-dust constants (a uniform one-level shift
 * yields c ≈ 0.99999999999999 — a zero-denominator test misses it),
 * and pooling that names why it cannot estimate instead of falling
 * silent. Deterministic throughout: seeded LCG, never Math.random.
 */
import { describe, expect, it } from 'vitest';

import {
  describeCorrelation,
  effectiveSampleRatio,
  lagOneAutocorrelation,
  poolNullCorrelation,
} from './visual-correlation.js';

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

/** A grey RGBA buffer of seeded per-pixel noise in [100, 140). */
function noiseImage(width: number, height: number, seed: number): Uint8Array {
  const random = lcg(seed);
  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const level = 100 + Math.floor(random() * 40);
    rgba[i * 4] = level;
    rgba[i * 4 + 1] = level;
    rgba[i * 4 + 2] = level;
    rgba[i * 4 + 3] = 255;
  }
  return rgba;
}

describe('lagOneAutocorrelation — exact readings on analytic fields', () => {
  const W = 64;
  const H = 32;

  it('reads sign-alternating constant rows as row (W−1)/W and col −(H−1)/H exactly', () => {
    // p[y][x] = ±A alternating by row: μ = 0 (H even); every horizontal
    // neighbour pair contributes +A², every vertical pair −A². The
    // shared-denominator biased ACF then reads exactly (W−1)/W along
    // rows and −(H−1)/H down columns — the shrink is the estimator's
    // fewer-numerator-terms bias, visible only at test-field sizes.
    const field = new Float64Array(W * H);
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        field[y * W + x] = y % 2 === 0 ? 5 : -5;
      }
    }
    const estimate = lagOneAutocorrelation(field, W, H);
    expect(estimate.ok && estimate.value.kind === 'estimated').toBe(true);
    if (!estimate.ok || estimate.value.kind !== 'estimated') {
      return;
    }
    expect(estimate.value.row).toBeCloseTo(63 / 64, 12);
    expect(estimate.value.col).toBeCloseTo(-31 / 32, 12);
  });

  it('reads paired constant-row blocks as col +1/32 exactly (both directions positive)', () => {
    // Rows in identical pairs, pair values alternating ±A: of the H−1
    // adjacent-row products, 16 are within-pair (+A²) and 15 cross
    // pairs (−A²), so col = (16−15)/H = 1/32; rows stay constant, so
    // row = (W−1)/W as above.
    const field = new Float64Array(W * H);
    for (let y = 0; y < H; y += 1) {
      for (let x = 0; x < W; x += 1) {
        field[y * W + x] = Math.floor(y / 2) % 2 === 0 ? 5 : -5;
      }
    }
    const estimate = lagOneAutocorrelation(field, W, H);
    expect(estimate.ok && estimate.value.kind === 'estimated').toBe(true);
    if (!estimate.ok || estimate.value.kind !== 'estimated') {
      return;
    }
    expect(estimate.value.row).toBeCloseTo(63 / 64, 12);
    expect(estimate.value.col).toBeCloseTo(1 / 32, 12);
  });

  it('reads seeded white noise as near-zero in both directions at 64×64', () => {
    const size = 64;
    const random = lcg(2026);
    const field = Float64Array.from({ length: size * size }, () => random() * 10);
    const estimate = lagOneAutocorrelation(field, size, size);
    expect(estimate.ok && estimate.value.kind === 'estimated').toBe(true);
    if (!estimate.ok || estimate.value.kind !== 'estimated') {
      return;
    }
    expect(Math.abs(estimate.value.row)).toBeLessThan(0.1);
    expect(Math.abs(estimate.value.col)).toBeLessThan(0.1);
  });

  it('names a constant field not estimable — including float-dust constants', () => {
    for (const level of [0, 76.245, 0.999_999_999_999_985_8]) {
      const field = new Float64Array(16 * 16).fill(level);
      const estimate = lagOneAutocorrelation(field, 16, 16);
      expect(estimate.ok && estimate.value.kind === 'constant-field').toBe(true);
    }
  });

  it('refuses a field whose length disagrees with its dimensions', () => {
    expect(lagOneAutocorrelation(new Float64Array(10), 4, 4).ok).toBe(false);
    expect(lagOneAutocorrelation(new Float64Array(0), 0, 0).ok).toBe(false);
  });
});

describe('effectiveSampleRatio — the separable AR(1) approximation, domain-gated', () => {
  it('computes known values inside the domain', () => {
    const independent = effectiveSampleRatio(0, 0);
    expect(independent.kind === 'estimated' && independent.value).toBe(1);
    const halves = effectiveSampleRatio(0.5, 0.5);
    expect(halves.kind).toBe('estimated');
    if (halves.kind === 'estimated') {
      expect(halves.value).toBeCloseTo(1 / 9, 12);
    }
    const mixed = effectiveSampleRatio(63 / 64, 1 / 32);
    expect(mixed.kind).toBe('estimated');
    if (mixed.kind === 'estimated') {
      expect(mixed.value).toBeCloseTo((1 / 127) * (31 / 33), 12);
    }
  });

  it('is monotone decreasing in each direction', () => {
    const lower = effectiveSampleRatio(0.4, 0.3);
    const higher = effectiveSampleRatio(0.2, 0.3);
    expect(lower.kind === 'estimated' && higher.kind === 'estimated').toBe(true);
    if (lower.kind === 'estimated' && higher.kind === 'estimated') {
      expect(higher.value).toBeGreaterThan(lower.value);
    }
  });

  it('refuses the AR(1) label when either lag-1 is negative', () => {
    // A negative lag-1 falsifies geometric ACF decay; the reciprocal
    // factors would then cancel a real correlation into a false
    // "independent" reading (ρr = −ρc → ratio exactly 1).
    expect(effectiveSampleRatio(-0.9844, 0.9844).kind).toBe('outside-ar1-domain');
    expect(effectiveSampleRatio(0.5, -0.01).kind).toBe('outside-ar1-domain');
  });
});

describe('poolNullCorrelation — pooling over same-page pairs', () => {
  it('estimates over noise captures and counts pairs and captures', () => {
    const captures = [noiseImage(32, 32, 1), noiseImage(32, 32, 2), noiseImage(32, 32, 3)];
    const pooled = poolNullCorrelation(captures, 32, 32);
    expect(pooled.ok && pooled.value.kind === 'estimated').toBe(true);
    if (!pooled.ok || pooled.value.kind !== 'estimated') {
      return;
    }
    expect(pooled.value.captureCount).toBe(3);
    expect(pooled.value.pairCount).toBe(3);
    expect(pooled.value.estimablePairCount).toBe(3);
    expect(Number.isFinite(pooled.value.lag1Row)).toBe(true);
    expect(Number.isFinite(pooled.value.lag1Col)).toBe(true);
  });

  it('names byte-stable captures not estimable instead of falling silent', () => {
    const grey = greyImage(32, 32, 100);
    const pooled = poolNullCorrelation([grey, grey, grey], 32, 32);
    expect(pooled.ok).toBe(true);
    if (!pooled.ok) {
      return;
    }
    expect(pooled.value).toEqual({
      kind: 'not-estimable',
      reason: 'zero-variance-diff-fields',
      pairCount: 3,
      captureCount: 3,
    });
  });

  it('names a uniform one-level shift not estimable — the float-dust constant diff', () => {
    const pooled = poolNullCorrelation([greyImage(32, 32, 100), greyImage(32, 32, 101)], 32, 32);
    expect(pooled.ok).toBe(true);
    if (!pooled.ok) {
      return;
    }
    expect(pooled.value.kind).toBe('not-estimable');
  });

  it('averages over the estimable pairs only, and counts them honestly', () => {
    const grey = greyImage(32, 32, 100);
    const pooled = poolNullCorrelation([grey, grey, noiseImage(32, 32, 4)], 32, 32);
    expect(pooled.ok && pooled.value.kind === 'estimated').toBe(true);
    if (!pooled.ok || pooled.value.kind !== 'estimated') {
      return;
    }
    expect(pooled.value.pairCount).toBe(3);
    expect(pooled.value.estimablePairCount).toBe(2);
    expect(pooled.value.captureCount).toBe(3);
  });

  it('refuses fewer than two captures', () => {
    expect(poolNullCorrelation([greyImage(8, 8, 100)], 8, 8).ok).toBe(false);
  });
});

describe('describeCorrelation — the summary line always names its situation', () => {
  it('prints the ratio inside the AR(1) domain', () => {
    const line = describeCorrelation({
      kind: 'estimated',
      lag1Row: 0.62,
      lag1Col: 0.58,
      nEff: { kind: 'estimated', value: 0.062 },
      pairCount: 21,
      estimablePairCount: 21,
      captureCount: 7,
    });
    expect(line).toContain('lag1 row=0.620 col=0.580');
    expect(line).toContain('n_eff/n=0.0620');
    expect(line).toContain('diagnostic only');
  });

  it('names the omission outside the AR(1) domain', () => {
    const line = describeCorrelation({
      kind: 'estimated',
      lag1Row: 0.62,
      lag1Col: -0.3,
      nEff: { kind: 'outside-ar1-domain' },
      pairCount: 3,
      estimablePairCount: 3,
      captureCount: 3,
    });
    expect(line).toContain('n_eff/n omitted');
    expect(line).toContain('AR(1)');
  });

  it('names the zero-variance situation instead of omitting the line', () => {
    const line = describeCorrelation({
      kind: 'not-estimable',
      reason: 'zero-variance-diff-fields',
      pairCount: 3,
      captureCount: 3,
    });
    expect(line).toContain('not estimable');
    expect(line).toContain('zero-variance');
  });
});
