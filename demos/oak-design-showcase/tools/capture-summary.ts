/**
 * Pure stdout-summary formatting for both capture arms (naive and
 * calibrated). Split from the capture tools so the honesty obligations
 * are testable without the browser import chain; capture code itself
 * stays in capture-pair.ts / capture-null.ts (the structural gate on
 * `.screenshot()` enumerates those files by name).
 *
 * Height honesty (the F04 cure): every capture's PRE-CROP height rides
 * the record, and a partial comparison announces itself FIRST — above
 * every statistic line — because the most dangerous summary is a clean
 * pass over erased divergence. Two distinct diseases, two lines:
 * a truncated tail (left vs right heights differ; the tail is absent
 * from every written PNG), and — calibrated arm only — settle variance
 * (left repeats disagree, so the pooled null is inflated and the
 * calibrated verdicts read CONSERVATIVE).
 */
import type { PairAnalysis } from '@oaknational/fidelity-review/visual-stats';
import type { CalibratedPairAnalysis } from '@oaknational/fidelity-review/visual-calibration';
import { describeCorrelation } from '@oaknational/fidelity-review/visual-correlation';

import type { PairRunRecord } from './capture-shared';

/** The truncated-tail caveat — comparison covers only the common
 *  region, and the written PNGs are cropped to it too. */
function tailCaveat(
  leftHeights: readonly number[],
  rightHeight: number,
  comparedHeight: number,
): string[] {
  const leftMin = Math.min(...leftHeights);
  if (leftMin === rightHeight) {
    return [];
  }
  return [
    `height mismatch: left=${leftMin}px right=${rightHeight}px — ` +
      `content below ${comparedHeight}px is not compared and is absent ` +
      `from every written PNG; adjudicate the tail at the live surfaces`,
  ];
}

/** The settle-variance caveat — left repeats that disagree damage the
 *  exchangeability warrant: the pooled null inflates, so calibrated
 *  rejection is conservative and real divergence can hide. */
function settleVarianceCaveat(leftHeights: readonly number[]): string[] {
  const min = Math.min(...leftHeights);
  const max = Math.max(...leftHeights);
  if (min === max) {
    return [];
  }
  return [
    `settle variance: left capture heights vary (${min}–${max}px across ` +
      `${leftHeights.length} repeats) — the pooled null is inflated and ` +
      `calibrated verdicts are CONSERVATIVE; recapture before adjudicating`,
  ];
}

/** The naive stdout summary: caveats first, then the causal frontier
 *  and top rejecting regions with σ-scores (DDR-010: the statistics
 *  direct the looking). */
export function summariseNaive(run: PairRunRecord<PairAnalysis>): string {
  const { analysis } = run;
  const top = analysis.rejecting.slice(0, 10);
  // The causal frontier: an offset shifts everything below it, so read
  // from the FIRST rejecting row, not the largest z (DDR-010).
  const firstY = analysis.rejecting.reduce(
    (min, windowScore) => Math.min(min, windowScore.y),
    Number.POSITIVE_INFINITY,
  );
  const frontier =
    analysis.rejecting.length > 0 ? ` first-rejecting-row=${firstY} (read top-down from here)` : '';
  const lines = [
    ...tailCaveat(run.leftHeights, run.rightHeight, analysis.height),
    `sigma0=${analysis.sigma0.toFixed(3)} windows=${analysis.scores.length} rejecting=${analysis.rejecting.length} (z ≥ ${analysis.threshold})${frontier}`,
    ...top.map(
      (windowScore) =>
        `  reject ${windowScore.z.toFixed(1)}σ at (${windowScore.x},${windowScore.y}) ${windowScore.w}×${windowScore.h} meanΔ=${windowScore.meanAbsDiff.toFixed(2)}`,
    ),
  ];
  if (analysis.rejecting.length > top.length) {
    lines.push(
      `  … ${analysis.rejecting.length - top.length} further rejecting windows in stats.json`,
    );
  }
  return lines.join('\n');
}

/** The calibrated stdout summary: caveats first, then the calibrated
 *  verdict with the naive z riding alongside — their disagreement is
 *  the honesty. */
export function summariseCalibrated(run: PairRunRecord<CalibratedPairAnalysis>): string {
  const { analysis } = run;
  const { calibration } = analysis;
  const top = analysis.calibratedRejecting.slice(0, 10);
  const lines = [
    ...settleVarianceCaveat(run.leftHeights),
    ...tailCaveat(run.leftHeights, run.rightHeight, analysis.height),
    `calibrated: N=${calibration.n} nullMax=${calibration.nullMax.toFixed(3)} ` +
      `floor=p<${calibration.floor.toExponential(2)} sigma-saturation=${calibration.sigmaSaturation.toFixed(2)} ` +
      `(naive --threshold is INERT under calibration)`,
    `rejecting=${analysis.calibratedRejecting.length} of ${analysis.scores.length} windows ` +
      `(beyond null max; naive z would reject ${analysis.rejecting.length})`,
    ...(calibration.correlation ? [describeCorrelation(calibration.correlation)] : []),
    ...top.map((windowScore) => {
      // A degenerate null (byte-stable page) has no finite exceedance
      // ratio — name the situation rather than printing a ×0.00 that
      // reads as below the null max.
      const magnitude =
        windowScore.exceedance === undefined
          ? '  reject (nonzero on a byte-stable page — null max is 0) at '
          : `  reject ×${windowScore.exceedance.toFixed(2)} of null max at `;
      return (
        `${magnitude}(${windowScore.x},${windowScore.y}) ${windowScore.w}×${windowScore.h} ` +
        `meanΔ=${windowScore.meanAbsDiff.toFixed(2)} σ=${(windowScore.calibratedSigma ?? 0).toFixed(2)} ` +
        `(naive z=${windowScore.z.toFixed(1)})`
      );
    }),
  ];
  if (analysis.calibratedRejecting.length > top.length) {
    lines.push(
      `  … ${analysis.calibratedRejecting.length - top.length} further calibrated rejections in stats.json`,
    );
  }
  return lines.join('\n');
}
