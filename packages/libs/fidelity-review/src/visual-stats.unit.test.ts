/**
 * The rejection statistics describe the system states that matter to the
 * review: an identical pair rejects nowhere; a genuinely moved region
 * rejects exactly where it moved, at a magnitude far past threshold; and
 * the noise estimate is robust, so a large divergent region cannot hide
 * itself by inflating σ. Buffers are synthetic — the claims are about the
 * statistics, not about any renderer.
 */
import { describe, expect, it } from 'vitest';

import { analysePair, renderHeatmapOverlay, robustSigma, toLuma } from './visual-stats';

const W = 128;
const H = 128;

function flat(value: number): Uint8Array {
  const buffer = new Uint8Array(W * H * 4);
  for (let i = 0; i < W * H; i += 1) {
    buffer[i * 4] = value;
    buffer[i * 4 + 1] = value;
    buffer[i * 4 + 2] = value;
    buffer[i * 4 + 3] = 255;
  }
  return buffer;
}

/** Paint a filled square of a given grey onto a copy of the base. */
function withSquare(
  base: Uint8Array,
  x0: number,
  y0: number,
  size: number,
  value: number,
): Uint8Array {
  const out = Uint8Array.from(base);
  for (let y = y0; y < y0 + size; y += 1) {
    for (let x = x0; x < x0 + size; x += 1) {
      const o = (y * W + x) * 4;
      out[o] = value;
      out[o + 1] = value;
      out[o + 2] = value;
    }
  }
  return out;
}

describe('toLuma', () => {
  it('refuses a buffer whose length disagrees with the stated dimensions', () => {
    const result = toLuma(new Uint8Array(10), W, H);
    expect(result.ok).toBe(false);
  });
});

describe('analysePair', () => {
  it('rejects nowhere on an identical pair', () => {
    const a = flat(200);
    const result = analysePair(a, Uint8Array.from(a), W, H);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.rejecting).toHaveLength(0);
    }
  });

  it('rejects exactly the windows covering a moved region, far past threshold', () => {
    const a = flat(200);
    const b = withSquare(a, 32, 32, 32, 40);
    const result = analysePair(a, b, W, H, { windowSize: 32 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.rejecting).toHaveLength(1);
    const [hit] = result.value.rejecting;
    expect(hit?.x).toBe(32);
    expect(hit?.y).toBe(32);
    // A 160-level luma shift over a whole window against sub-level noise:
    // the rejection is unambiguous, not marginal.
    expect(hit?.z ?? 0).toBeGreaterThan(100);
  });

  it('keeps sigma robust: a large divergent region cannot hide itself', () => {
    const a = flat(200);
    // A quarter of the image differs strongly; MAD over the whole field
    // still reads the quiet majority, so σ stays at the floor and the
    // divergent windows all reject.
    const b = withSquare(a, 0, 0, 64, 40);
    const result = analysePair(a, b, W, H, { windowSize: 32 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.sigma0).toBeLessThan(1);
    expect(result.value.rejecting).toHaveLength(4);
  });

  it('refuses mismatched buffer dimensions through the Result channel', () => {
    const result = analysePair(flat(0), new Uint8Array(8), W, H);
    expect(result.ok).toBe(false);
  });
});

describe('robustSigma', () => {
  it('floors at half a quantisation level on a zero-difference field', () => {
    expect(robustSigma(new Float64Array(1024))).toBe(0.5);
  });
});

describe('renderHeatmapOverlay', () => {
  it('tints only the rejecting windows and leaves the base untouched', () => {
    const a = flat(200);
    const b = withSquare(a, 96, 96, 32, 20);
    const result = analysePair(a, b, W, H, { windowSize: 32 });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const overlay = renderHeatmapOverlay(a, W, result.value);
    // Inside the rejecting window the red channel rises above the base…
    const inside = ((96 + 4) * W + (96 + 4)) * 4;
    expect(overlay[inside] ?? 0).toBeGreaterThan(200);
    // …outside it the pixels are byte-identical, and the base is untouched.
    const outside = (4 * W + 4) * 4;
    expect(overlay[outside]).toBe(200);
    expect(a[inside]).toBe(200);
  });
});
