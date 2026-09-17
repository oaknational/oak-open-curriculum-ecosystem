/**
 * Correlation diagnostics inside the empirical null (DDR-010 dated
 * amendment; S2b). Pixel noise is spatially correlated, so the naive
 * z's √n overstates the information in a window; these estimators
 * measure HOW MUCH, from the same repeat-capture diff fields the null
 * is pooled from. DIAGNOSTIC ONLY, structurally: nothing here touches
 * the calibrated rank — the empirical quantiles already absorb spatial
 * correlation, and correcting the z-scale on top of the empirical null
 * would double-count. The diagnostic exists to keep the naive-z reader
 * honest.
 *
 * Pure throughout: buffers in, records out — capture and persistence
 * stay with the callers.
 */
import { err, ok, type Result } from '@oaknational/result';

import { diffField, toLuma } from './visual-stats.js';

/** Lag-1 autocorrelation of a field, or the named reason none exists.
 *  `constant-field` is decided by an EXACT all-equal scan, never a
 *  zero-denominator test: a uniform one-level colour shift yields a
 *  constant diff value of ≈0.99999999999999 whose float-dust
 *  deviations pass a denominator test and manufacture ρ ≈ 0.999. */
export type LagOneEstimate =
  | { readonly kind: 'estimated'; readonly row: number; readonly col: number }
  | { readonly kind: 'constant-field' };

/** The separable-AR(1) effective-sample-size ratio, or the named
 *  refusal: a negative lag-1 falsifies geometric ACF decay, and in
 *  the product formula a negative factor is its mirror's reciprocal —
 *  ρr = −ρc reads as EXACTLY 1 ("independent") on a maximally
 *  correlated field, so outside the domain the report is the omission. */
export type EffectiveSampleRatio =
  { readonly kind: 'estimated'; readonly value: number } | { readonly kind: 'outside-ar1-domain' };

/** Pooled correlation diagnostics for a same-page null. `pairCount` is
 *  ALWAYS the examined total C(captureCount, 2); the estimated arm adds
 *  `estimablePairCount` (non-constant diff fields). Pairs share
 *  captures — `captureCount` is the independent-capture budget. */
export type CorrelationDiagnostics =
  | {
      readonly kind: 'estimated';
      readonly lag1Row: number;
      readonly lag1Col: number;
      /** Approximation of the window-mean variance inflation under a
       *  SEPARABLE AR(1) field with non-negative lag-1 in each
       *  direction, asymptotic in n — reported, never applied to the
       *  calibrated rank. */
      readonly nEff: EffectiveSampleRatio;
      readonly pairCount: number;
      readonly estimablePairCount: number;
      readonly captureCount: number;
    }
  | {
      readonly kind: 'not-estimable';
      readonly reason: 'zero-variance-diff-fields';
      readonly pairCount: number;
      readonly captureCount: number;
    };

/** Exact field degeneracy: every value identical to the first. */
function isConstant(field: Float64Array): boolean {
  for (let i = 1; i < field.length; i += 1) {
    if (field[i] !== field[0]) {
      return false;
    }
  }
  return true;
}

/** The standard biased lag-1 autocorrelation of a 2D field in each
 *  direction: deviations from the full-field mean, adjacent-neighbour
 *  products in the numerator (row: x with x+1, never wrapping; col: y
 *  with y+1), and the all-pixels sum of squared deviations as the
 *  shared denominator. The biased form is positive-semidefinite and is
 *  the shape a variance-inflation calculation needs; it reads a
 *  perfectly row-constant field as (W−1)/W, not 1 — the shrink is the
 *  estimator, visible only at test-field sizes. */
export function lagOneAutocorrelation(
  field: Float64Array,
  width: number,
  height: number,
): Result<LagOneEstimate, string> {
  if (field.length === 0 || field.length !== width * height) {
    return err(`field length ${field.length} is not width×height (${width}×${height})`);
  }
  if (isConstant(field)) {
    return ok({ kind: 'constant-field' });
  }
  let sum = 0;
  for (const value of field) {
    sum += value;
  }
  const { den, rowNum, colNum } = lagOneSums(field, width, height, sum / field.length);
  return ok({ kind: 'estimated', row: rowNum / den, col: colNum / den });
}

/** Deviation-product sums for both directions plus the shared
 *  all-pixels denominator. */
function lagOneSums(
  field: Float64Array,
  width: number,
  height: number,
  mu: number,
): { readonly den: number; readonly rowNum: number; readonly colNum: number } {
  let den = 0;
  let rowNum = 0;
  let colNum = 0;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const d = (field[y * width + x] ?? 0) - mu;
      den += d * d;
      if (x < width - 1) {
        rowNum += d * ((field[y * width + x + 1] ?? 0) - mu);
      }
      if (y < height - 1) {
        colNum += d * ((field[(y + 1) * width + x] ?? 0) - mu);
      }
    }
  }
  return { den, rowNum, colNum };
}

/** n_eff/n under a separable AR(1) model:
 *  (1−ρr)/(1+ρr) · (1−ρc)/(1+ρc), valid only for non-negative lag-1 in
 *  both directions (see EffectiveSampleRatio for why the domain gate
 *  exists). Computed on the absolute-difference field because that is
 *  the field whose window mean IS the rejection statistic. */
export function effectiveSampleRatio(lag1Row: number, lag1Col: number): EffectiveSampleRatio {
  if (lag1Row < 0 || lag1Col < 0) {
    return { kind: 'outside-ar1-domain' };
  }
  const rowFactor = (1 - lag1Row) / (1 + lag1Row);
  const colFactor = (1 - lag1Col) / (1 + lag1Col);
  return { kind: 'estimated', value: rowFactor * colFactor };
}

/** The luma of every capture, or the first conversion error. */
function lumasOf(
  captures: readonly Uint8Array[],
  width: number,
  height: number,
): Result<Float64Array[], string> {
  const lumas: Float64Array[] = [];
  for (const [index, capture] of captures.entries()) {
    const luma = toLuma(capture, width, height);
    if (!luma.ok) {
      return err(`capture ${index + 1}/${captures.length}: ${luma.error}`);
    }
    lumas.push(luma.value);
  }
  return ok(lumas);
}

/** Running ρ sums over every same-page pair, with the estimable pair
 *  count (every pair is examined — the caller derives the total as
 *  C(captures, 2)). */
function pairwiseLagOne(
  lumas: readonly Float64Array[],
  width: number,
  height: number,
): Result<
  { readonly rowSum: number; readonly colSum: number; readonly estimable: number },
  string
> {
  let rowSum = 0;
  let colSum = 0;
  let estimable = 0;
  for (let i = 0; i < lumas.length; i += 1) {
    for (let j = i + 1; j < lumas.length; j += 1) {
      const a = lumas[i];
      const b = lumas[j];
      if (a === undefined || b === undefined) {
        return err('null correlation indexed a missing capture — report this');
      }
      const estimate = lagOneAutocorrelation(diffField(a, b), width, height);
      if (!estimate.ok) {
        return estimate;
      }
      if (estimate.value.kind === 'estimated') {
        rowSum += estimate.value.row;
        colSum += estimate.value.col;
        estimable += 1;
      }
    }
  }
  return ok({ rowSum, colSum, estimable });
}

/** Pool lag-1 diagnostics over every same-page pair of null captures
 *  (the same pairing the null scores pool over, each i with every
 *  later j): ρ estimates average over the estimable pairs; a null
 *  whose every pair has a zero-variance diff field reports
 *  `not-estimable` by name. */
export function poolNullCorrelation(
  captures: readonly Uint8Array[],
  width: number,
  height: number,
): Result<CorrelationDiagnostics, string> {
  if (captures.length < 2) {
    return err(`null correlation needs at least two captures; saw ${captures.length}`);
  }
  const lumas = lumasOf(captures, width, height);
  if (!lumas.ok) {
    return lumas;
  }
  const sums = pairwiseLagOne(lumas.value, width, height);
  if (!sums.ok) {
    return sums;
  }
  const { rowSum, colSum, estimable } = sums.value;
  if (estimable === 0) {
    return ok({
      kind: 'not-estimable',
      reason: 'zero-variance-diff-fields',
      pairCount: (captures.length * (captures.length - 1)) / 2,
      captureCount: captures.length,
    });
  }
  const lag1Row = rowSum / estimable;
  const lag1Col = colSum / estimable;
  return ok({
    kind: 'estimated',
    lag1Row,
    lag1Col,
    nEff: effectiveSampleRatio(lag1Row, lag1Col),
    pairCount: (captures.length * (captures.length - 1)) / 2,
    estimablePairCount: estimable,
    captureCount: captures.length,
  });
}

/** The one summary line for the diagnostics — it always names its
 *  situation (estimated / ratio omitted / not estimable), never falls
 *  silent, mirroring the degenerate-null convention. */
export function describeCorrelation(diagnostics: CorrelationDiagnostics): string {
  if (diagnostics.kind === 'not-estimable') {
    return (
      `null correlation: not estimable — every null pair had a zero-variance diff field ` +
      `(${diagnostics.pairCount} pairs of ${diagnostics.captureCount} captures)`
    );
  }
  const base =
    `null correlation (diagnostic only): lag1 row=${diagnostics.lag1Row.toFixed(3)} ` +
    `col=${diagnostics.lag1Col.toFixed(3)} over ${diagnostics.estimablePairCount} of ` +
    `${diagnostics.pairCount} pairs (${diagnostics.captureCount} captures)`;
  return diagnostics.nEff.kind === 'estimated'
    ? `${base} n_eff/n=${diagnostics.nEff.value.toPrecision(3)} — the empirical quantiles already absorb this`
    : `${base} — n_eff/n omitted (negative lag-1 is outside the AR(1) domain)`;
}
