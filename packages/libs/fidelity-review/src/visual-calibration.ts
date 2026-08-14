/**
 * Empirical null calibration for the windowed rejection statistics
 * (DDR-010 §Known limits, owner word 2026-08-11: σ should at least
 * approximate the meaning of calibrated probabilities). The null is the
 * distribution of window mean-absolute-luma-differences over SAME-PAGE
 * repeat-capture pairs — everything the pair shares (anti-aliasing, font
 * raster jitter, settle residue) and nothing it does not. A live
 * window's raw meanAbsDiff is ranked against that null — RAW, never z:
 * ranking the statistic itself removes the per-pair σ₀ (and its MAD
 * floor) from the calibrated path entirely.
 *
 * Honesty is structural in this module (full rationale: DDR-010's dated
 * calibration amendment):
 * - empiricalP is the continuity-corrected exact rank
 *   p = (1 + count(null ≥ observed)) / (N + 1), ties counting AGAINST
 *   rejection; calibratedSigma = Φ⁻¹(1 − p) SATURATES at Φ⁻¹(N/(N+1))
 *   (≈ 4σ at any feasible k) — a naive z of 100 disagreeing loudly with
 *   a calibrated σ of 4 is the point.
 * - Under calibration the naive threshold is INERT: rejection is
 *   meanAbsDiff beyond nullMax, the floor 1/(N+1) in the summary.
 * - Only FULL windows are pooled or calibrated; partial edge windows
 *   are marked uncalibrated with the reason, never silently pooled. The
 *   pooled null licenses the MARGINAL claim, never per-location.
 *
 * Pure throughout: scores in, records out. Capture, settle identity,
 * and persistence stay with the callers (the settle recipe travelling
 * identically on null and live captures is the exchangeability warrant
 * behind the rank — the CLI owns that invariant).
 *
 * The summary can CARRY correlation diagnostics (S2b — estimators in
 * visual-correlation.ts): reporting only, by construction — the
 * calibrated rank never reads them, because the empirical quantiles
 * already absorb spatial correlation and correcting twice would
 * double-count.
 */
import { err, ok, type Result } from '@oaknational/result';

import { inverseNormalCdf } from './inverse-normal-cdf.js';
import { tintWindows } from './visual-stats.js';
import type { PairAnalysis, WindowScore } from './visual-stats.js';
import type { CorrelationDiagnostics } from './visual-correlation.js';

/** How many exact tail order statistics the summary retains: the
 *  1/(N+1) floor is only a true claim if tail ranks stay exact — a
 *  fixed-resolution quantile table cannot recover them. */
export const TAIL_ORDER_STATS = 100;

export interface CalibrationSummary {
  /** Pooled null window count (full windows across all same-page pairs). */
  readonly n: number;
  /** The largest null window score — the rejection bar under calibration. */
  readonly nullMax: number;
  /** The instrument's resolution floor: 1/(N+1). */
  readonly floor: number;
  /** Where calibratedSigma saturates: Φ⁻¹(N/(N+1)). */
  readonly sigmaSaturation: number;
  /** Top exact order statistics, descending — the tail the floor claim
   *  rests on. */
  readonly tailOrderStats: readonly number[];
  /** Coarse display quantiles of the null (p50/p90/p99). */
  readonly quantiles: Readonly<Record<'p50' | 'p90' | 'p99', number>>;
  /** Correlation diagnostics of the null diff fields (S2b) — carried
   *  verbatim from the caller, REPORTING ONLY: the rank never reads
   *  them (the quantiles already absorb correlation). */
  readonly correlation?: CorrelationDiagnostics;
}

export interface CalibratedWindowScore extends WindowScore {
  /** Continuity-corrected exact empirical p — absent on partial windows. */
  readonly empiricalP?: number;
  /** Φ⁻¹(1 − empiricalP) — absent on partial windows. */
  readonly calibratedSigma?: number;
  /** Ratio meanAbsDiff / nullMax — the calibrated attention weight. */
  readonly exceedance?: number;
  /** Named reason a window carries no calibrated fields. */
  readonly uncalibrated?: 'partial-window';
}

export interface CalibratedPairAnalysis extends Omit<PairAnalysis, 'scores' | 'rejecting'> {
  readonly scores: readonly CalibratedWindowScore[];
  /** Windows beyond the null maximum, strongest exceedance first — the
   *  rejection set under calibration (the naive threshold is inert). */
  readonly calibratedRejecting: readonly CalibratedWindowScore[];
  /** The naive rejecting set, retained for the honest disagreement. */
  readonly rejecting: readonly CalibratedWindowScore[];
  readonly calibration: CalibrationSummary;
}

/** Count of sorted-ascending values ≥ observed, by binary search. */
function countAtLeast(sortedAsc: readonly number[], observed: number): number {
  let lo = 0;
  let hi = sortedAsc.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if ((sortedAsc[mid] ?? 0) >= observed) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return sortedAsc.length - lo;
}

function quantile(sortedAsc: readonly number[], p: number): number {
  const index = Math.min(sortedAsc.length - 1, Math.max(0, Math.ceil(p * sortedAsc.length) - 1));
  return sortedAsc[index] ?? 0;
}

function buildSummary(
  sortedAsc: readonly number[],
  sigmaSaturation: number,
  correlation?: CorrelationDiagnostics,
): CalibrationSummary {
  const n = sortedAsc.length;
  return {
    n,
    nullMax: sortedAsc[n - 1] ?? 0,
    floor: 1 / (n + 1),
    sigmaSaturation,
    tailOrderStats: sortedAsc.slice(-TAIL_ORDER_STATS).reverse(),
    quantiles: {
      p50: quantile(sortedAsc, 0.5),
      p90: quantile(sortedAsc, 0.9),
      p99: quantile(sortedAsc, 0.99),
    },
    ...(correlation ? { correlation } : {}),
  };
}

/** Calibrate one FULL window. Φ⁻¹(1−p) fails only at p = 1 (a window at
 *  or below EVERY null score, true value −∞): it saturates at the LOW
 *  end, the mirror of the high-end cap — the old fallback stamped
 *  +saturation on exactly the quietest windows. A DEGENERATE null
 *  (byte-stable repeat captures, nullMax 0) has no finite exceedance —
 *  the field is omitted, never an Infinity JSON would turn into null. */
function calibrateWindow(
  windowScore: WindowScore,
  sortedAsc: readonly number[],
  nullMax: number,
  saturation: number,
): CalibratedWindowScore {
  const n = sortedAsc.length;
  const p = (1 + countAtLeast(sortedAsc, windowScore.meanAbsDiff)) / (n + 1);
  const sigma = inverseNormalCdf(1 - p);
  return {
    ...windowScore,
    empiricalP: p,
    calibratedSigma: sigma.ok ? sigma.value : -saturation,
    ...(nullMax > 0 ? { exceedance: windowScore.meanAbsDiff / nullMax } : {}),
  };
}

/**
 * Calibrate an analysis against pooled same-page null window scores
 * (full windows only — the caller harvests them on the SAME window grid
 * as the live analysis; grid identity is the caller's obligation and
 * captured heights are its evidence).
 */
export function calibrateAnalysis(
  analysis: PairAnalysis,
  nullScores: readonly number[],
  options: { readonly correlation?: CorrelationDiagnostics } = {},
): Result<CalibratedPairAnalysis, string> {
  if (nullScores.length === 0) {
    return err('calibration needs at least one null window score');
  }
  const sortedAsc = [...nullScores].sort((x, y) => x - y);
  const nullMax = sortedAsc.at(-1) ?? 0;
  const saturation = inverseNormalCdf(sortedAsc.length / (sortedAsc.length + 1));
  if (!saturation.ok) {
    return err(saturation.error);
  }
  const fullN = analysis.windowSize * analysis.windowSize;
  const scores: CalibratedWindowScore[] = analysis.scores.map((windowScore) =>
    windowScore.n === fullN
      ? calibrateWindow(windowScore, sortedAsc, nullMax, saturation.value)
      : { ...windowScore, uncalibrated: 'partial-window' },
  );
  const calibratedRejecting = scores
    .filter((s) => s.uncalibrated === undefined && s.meanAbsDiff > nullMax)
    .sort((p1, p2) => (p2.exceedance ?? p2.meanAbsDiff) - (p1.exceedance ?? p1.meanAbsDiff));
  const naiveRejecting = scores
    .filter((s) => s.z >= analysis.threshold)
    .sort((p1, p2) => p2.z - p1.z);
  return ok({
    ...analysis,
    scores,
    rejecting: naiveRejecting,
    calibratedRejecting,
    calibration: buildSummary(sortedAsc, saturation.value, options.correlation),
  });
}

/** The calibrated heatmap: EXCEEDANCE drives the tint (strength
 *  min(exceedance/3, 1) — at the null max a window reads as a light
 *  tint, at three times the null max as a full flag), mirroring the
 *  naive overlay's z/(3·threshold) shape on the calibrated scale. Under
 *  a degenerate null (no exceedance ratio exists) every rejection is a
 *  full flag — on a byte-stable page any difference is the finding. */
export function renderCalibratedHeatmap(
  base: Uint8Array,
  width: number,
  analysis: CalibratedPairAnalysis,
): Uint8Array {
  return tintWindows(
    base,
    width,
    analysis.calibratedRejecting.map((window) => ({
      window,
      strength: window.exceedance === undefined ? 1 : Math.min(window.exceedance / 3, 1),
    })),
  );
}
