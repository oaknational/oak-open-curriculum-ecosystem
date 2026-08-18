/**
 * Windowed statistical rejection over an image pair (DDR-010: comparison is
 * visual first, and the statistics DIRECT the looking rather than replace
 * it). Linear subtraction alone treats a one-pixel anti-aliasing shimmer
 * and a moved heading identically; this module asks, per window, whether
 * the local difference REJECTS being trivial at a stated significance —
 * "this area differs from the same area in the other image at ≥6σ" — so a
 * reader (human or LLM) is pointed at the regions that matter, with the
 * magnitude attached.
 *
 * Model, stated so the numbers stay honest: per-pixel absolute luma
 * differences are treated as draws from a zero-centred noise field whose
 * scale σ₀ is estimated ROBUSTLY from the whole pair (median absolute
 * deviation × 1.4826 — real divergent regions inflate a naive standard
 * deviation and hide themselves; the median resists them). Under that
 * null, a window's mean difference has standard error σ₀/√n, and its
 * z-score is the rejection statistic. The output is descriptive
 * statistics, not a hypothesis test with guaranteed error rates — pixel
 * noise is neither independent nor Gaussian — but the ordering it induces
 * over windows is exactly the attention map the review needs, and the σ
 * vocabulary gives thresholds a stable meaning across pairs.
 *
 * Pure throughout: buffers in, records out; PNG codec and filesystem stay
 * with the callers.
 */
import { err, ok, type Result } from '@oaknational/result';

export interface WindowScore {
  /** Window origin and size in pixels. */
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  /** Pixels in the window. */
  readonly n: number;
  /** Mean absolute luma difference (0-255 scale). */
  readonly meanAbsDiff: number;
  /** Rejection statistic: meanAbsDiff / (sigma0 / sqrt(n)). */
  readonly z: number;
}

export interface PairAnalysis {
  readonly width: number;
  readonly height: number;
  /** Robust per-pixel noise scale (MAD × 1.4826, floored — see analysePair). */
  readonly sigma0: number;
  readonly windowSize: number;
  readonly threshold: number;
  /** Every window, in row-major order. */
  readonly scores: readonly WindowScore[];
  /** Windows whose z meets the threshold, strongest first. */
  readonly rejecting: readonly WindowScore[];
}

/** ITU-R BT.709 luma from an RGBA buffer. */
export function toLuma(
  rgba: Uint8Array,
  width: number,
  height: number,
): Result<Float64Array, string> {
  if (rgba.length !== width * height * 4) {
    return err(
      `buffer length ${rgba.length} is not width×height×4 (${width}×${height}×4 = ${width * height * 4})`,
    );
  }
  const luma = new Float64Array(width * height);
  for (let i = 0; i < luma.length; i += 1) {
    const o = i * 4;
    const r = rgba[o] ?? 0;
    const g = rgba[o + 1] ?? 0;
    const b = rgba[o + 2] ?? 0;
    luma[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return ok(luma);
}

/** The median of a numeric array (copy-sorts; callers pass working data). */
function median(values: Float64Array): number {
  const sorted = Float64Array.from(values).sort();
  const mid = Math.floor(sorted.length / 2);
  const lower = sorted[mid - 1] ?? 0;
  const upper = sorted[mid] ?? 0;
  return sorted.length % 2 === 0 ? (lower + upper) / 2 : upper;
}

/** Robust noise scale: MAD × 1.4826 (the Gaussian consistency constant).
 *  Floored at 0.5 luma levels — a pair of byte-identical renders has zero
 *  MAD, and a zero σ would make every nonzero window infinitely
 *  significant; half a quantisation level is the smallest honest noise
 *  claim for 8-bit channels. */
export function robustSigma(diff: Float64Array): number {
  const m = median(diff);
  const deviations = new Float64Array(diff.length);
  for (let i = 0; i < diff.length; i += 1) {
    deviations[i] = Math.abs((diff[i] ?? 0) - m);
  }
  return Math.max(median(deviations) * 1.4826, 0.5);
}

/** The absolute per-pixel luma difference field of a validated pair —
 *  exported at its second consumer (visual-correlation's null pooling);
 *  callers guarantee equal lengths, as analysePair does via toLuma. */
export function diffField(lumaA: Float64Array, lumaB: Float64Array): Float64Array {
  const diff = new Float64Array(lumaA.length);
  for (let i = 0; i < diff.length; i += 1) {
    diff[i] = Math.abs((lumaA[i] ?? 0) - (lumaB[i] ?? 0));
  }
  return diff;
}

/** One window's summary over the difference field. */
function scoreWindow(
  diff: Float64Array,
  width: number,
  origin: { readonly x: number; readonly y: number; readonly w: number; readonly h: number },
  sigma0: number,
): WindowScore {
  const n = origin.w * origin.h;
  let sum = 0;
  for (let dy = 0; dy < origin.h; dy += 1) {
    const row = (origin.y + dy) * width + origin.x;
    for (let dx = 0; dx < origin.w; dx += 1) {
      sum += diff[row + dx] ?? 0;
    }
  }
  const meanAbsDiff = sum / n;
  return { ...origin, n, meanAbsDiff, z: meanAbsDiff / (sigma0 / Math.sqrt(n)) };
}

/** Every window of the grid, row-major. */
function scoreWindows(
  diff: Float64Array,
  width: number,
  height: number,
  windowSize: number,
  sigma0: number,
): WindowScore[] {
  const scores: WindowScore[] = [];
  for (let y = 0; y < height; y += windowSize) {
    for (let x = 0; x < width; x += windowSize) {
      const w = Math.min(windowSize, width - x);
      const h = Math.min(windowSize, height - y);
      scores.push(scoreWindow(diff, width, { x, y, w, h }, sigma0));
    }
  }
  return scores;
}

/** Analyse a pair of same-sized RGBA buffers. windowSize defaults to 32px
 *  (fine enough to localise a moved control, coarse enough that n keeps
 *  the standard error meaningful); threshold defaults to 6 (six sigma). */
export function analysePair(
  a: Uint8Array,
  b: Uint8Array,
  width: number,
  height: number,
  options: { readonly windowSize?: number; readonly threshold?: number } = {},
): Result<PairAnalysis, string> {
  const windowSize = options.windowSize ?? 32;
  const threshold = options.threshold ?? 6;
  if (windowSize < 4) {
    return err(`windowSize ${windowSize} is below the 4px floor`);
  }
  const lumaA = toLuma(a, width, height);
  if (!lumaA.ok) {
    return err(`left image: ${lumaA.error}`);
  }
  const lumaB = toLuma(b, width, height);
  if (!lumaB.ok) {
    return err(`right image: ${lumaB.error}`);
  }
  const diff = diffField(lumaA.value, lumaB.value);
  const sigma0 = robustSigma(diff);
  const scores = scoreWindows(diff, width, height, windowSize, sigma0);
  const rejecting = scores.filter((s) => s.z >= threshold).sort((p, q) => q.z - p.z);
  return ok({ width, height, sigma0, windowSize, threshold, scores, rejecting });
}

/** Blend the given windows towards red over a COPY of the base image,
 *  each at its own strength in [0, 1] — the one tint loop every heatmap
 *  variant (naive z, calibrated exceedance) drives. */
export function tintWindows(
  base: Uint8Array,
  width: number,
  entries: readonly { readonly window: WindowScore; readonly strength: number }[],
): Uint8Array {
  const out = Uint8Array.from(base);
  for (const { window, strength } of entries) {
    for (let dy = 0; dy < window.h; dy += 1) {
      for (let dx = 0; dx < window.w; dx += 1) {
        const o = ((window.y + dy) * width + (window.x + dx)) * 4;
        out[o] = Math.round((out[o] ?? 0) * (1 - strength) + 255 * strength);
        out[o + 1] = Math.round((out[o + 1] ?? 0) * (1 - strength * 0.85));
        out[o + 2] = Math.round((out[o + 2] ?? 0) * (1 - strength * 0.85));
      }
    }
  }
  return out;
}

/** Paint the rejection map over a copy of the base image: rejecting
 *  windows blend towards red with strength ∝ min(z / (3·threshold), 1),
 *  so a just-rejecting window reads as a tint and a gross divergence
 *  reads as a flag. Returns a NEW buffer; the base is untouched. */
export function renderHeatmapOverlay(
  base: Uint8Array,
  width: number,
  analysis: PairAnalysis,
): Uint8Array {
  return tintWindows(
    base,
    width,
    analysis.rejecting.map((window) => ({
      window,
      strength: Math.min(window.z / (3 * analysis.threshold), 1),
    })),
  );
}
