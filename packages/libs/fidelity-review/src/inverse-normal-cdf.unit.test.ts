/**
 * Φ⁻¹ contract: known standard-normal quantiles, closed-endpoint
 * refusal, and monotonicity over a seeded sample of the domain.
 */
import { describe, expect, it } from 'vitest';

import { inverseNormalCdf } from './inverse-normal-cdf.js';

/** Seeded LCG (Numerical Recipes constants) — deterministic test noise. */
function lcg(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state / 2 ** 32;
  };
}

describe('inverseNormalCdf', () => {
  it('matches known quantiles of the standard normal', () => {
    const median = inverseNormalCdf(0.5);
    expect(median.ok && Math.abs(median.value) < 1e-9).toBe(true);
    const upper = inverseNormalCdf(0.975);
    expect(upper.ok && Math.abs(upper.value - 1.959_964) < 1e-4).toBe(true);
    const tail = inverseNormalCdf(0.999);
    expect(tail.ok && Math.abs(tail.value - 3.090_232) < 1e-4).toBe(true);
  });

  it('rejects the closed endpoints and values outside (0, 1)', () => {
    for (const p of [0, 1, -0.1, 1.1, Number.NaN]) {
      expect(inverseNormalCdf(p).ok).toBe(false);
    }
  });

  it('is monotone over a seeded sample of the domain', () => {
    const random = lcg(42);
    const ps = Array.from({ length: 200 }, () => 0.0001 + random() * 0.9998).sort((a, b) => a - b);
    const values = ps.map((p) => {
      const result = inverseNormalCdf(p);
      expect(result.ok).toBe(true);
      return result.ok ? result.value : Number.NaN;
    });
    for (let i = 1; i < values.length; i += 1) {
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1] ?? Number.NaN);
    }
  });
});
