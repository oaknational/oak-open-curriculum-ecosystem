/**
 * The calibrated arm of capture-pair (S2a, DDR-010 §Known limits): with
 * `--null-runs k` the LEFT url is captured k+1 times and the right once
 * — serial, one fresh browser per capture, every capture through the
 * estate settle recipe, exactly like the live path, because that
 * identity is the exchangeability warrant behind the empirical rank.
 * All k+2 captures crop to their common minimum height so the null and
 * the live pair share one window grid; the same-page pairs' FULL
 * windows pool into the null; the live pair is then calibrated against
 * it. The live pair's LEFT capture also participates in the null pairs
 * — a deliberate double use, consistent with the marginal claim the
 * pooled null licenses (and it keeps every capture informative at small
 * k). Per-capture heights ride the stats block — a height that varies
 * across repeats is itself a settle finding.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { FONTS_READY_BUDGET_MS, SETTLE_MS } from '@oaknational/fidelity-review/capture-settle';
import { cropToHeight } from '@oaknational/fidelity-review/png-codec';
import { analysePair } from '@oaknational/fidelity-review/visual-stats';
import {
  calibrateAnalysis,
  renderCalibratedHeatmap,
  type CalibratedPairAnalysis,
} from '@oaknational/fidelity-review/visual-calibration';
import { poolNullCorrelation } from '@oaknational/fidelity-review/visual-correlation';

import {
  captureRgba,
  writePairPngs,
  type CapturePairConfig,
  type PairRunRecord,
} from './capture-shared';

/** Serial settled captures: left ×(k+1), then right — order recorded by
 *  position (index k+1 is the right capture). */
async function captureAll(
  config: CapturePairConfig,
  nullRuns: number,
): Promise<Result<{ rgba: Uint8Array; height: number }[], string>> {
  const captures: { rgba: Uint8Array; height: number }[] = [];
  for (let i = 0; i < nullRuns + 1; i += 1) {
    const capture = await captureRgba(config.left, config.width);
    if (!capture.ok) {
      return err(`left capture ${i + 1}/${nullRuns + 1}: ${capture.error}`);
    }
    captures.push(capture.value);
  }
  const right = await captureRgba(config.right, config.width);
  if (!right.ok) {
    return err(`right: ${right.error}`);
  }
  captures.push(right.value);
  return ok(captures);
}

/** The FULL-window scores of one same-page pair — partial windows never
 *  enter the null (their distribution is wider); the live analysis
 *  marks its own partial windows uncalibrated to match. */
function fullWindowScores(
  a: Uint8Array,
  b: Uint8Array,
  width: number,
  height: number,
  windowSize: number,
): Result<number[], string> {
  const analysis = analysePair(a, b, width, height, { windowSize });
  if (!analysis.ok) {
    return analysis;
  }
  const fullN = windowSize * windowSize;
  return ok(analysis.value.scores.filter((s) => s.n === fullN).map((s) => s.meanAbsDiff));
}

/** Pool the full windows of every same-page left pair. */
function poolNullScores(
  lefts: readonly Uint8Array[],
  width: number,
  height: number,
  windowSize: number,
): Result<number[], string> {
  const scores: number[] = [];
  for (let i = 0; i < lefts.length; i += 1) {
    for (let j = i + 1; j < lefts.length; j += 1) {
      const a = lefts[i];
      const b = lefts[j];
      if (a === undefined || b === undefined) {
        return err('null pairing indexed a missing capture — report this');
      }
      const pairScores = fullWindowScores(a, b, width, height, windowSize);
      if (!pairScores.ok) {
        return err(`null pair ${i}×${j}: ${pairScores.error}`);
      }
      scores.push(...pairScores.value);
    }
  }
  return ok(scores);
}

/** Crop every capture to the common minimum height — null and live pair
 *  must share one window grid. */
function cropAll(
  captures: readonly { rgba: Uint8Array; height: number }[],
  width: number,
): Result<{ cropped: Uint8Array[]; height: number; heights: number[] }, string> {
  const heights = captures.map((c) => c.height);
  const height = Math.min(...heights);
  const cropped: Uint8Array[] = [];
  for (const capture of captures) {
    const crop = cropToHeight(capture.rgba, width, capture.height, height);
    if (!crop.ok) {
      return err('crop refused a capture the codec accepted — report this');
    }
    cropped.push(crop.value);
  }
  return ok({ cropped, height, heights });
}

function writeCalibratedStats(
  config: CapturePairConfig,
  nullRuns: number,
  heights: { leftHeights: readonly number[]; rightHeight: number },
  calibrated: CalibratedPairAnalysis,
): void {
  writeFileSync(
    join(config.out, `${config.tag}-stats.json`),
    `${JSON.stringify(
      {
        left: config.left,
        right: config.right,
        nullRuns,
        pairCount: (nullRuns * (nullRuns + 1)) / 2,
        leftHeights: heights.leftHeights,
        rightHeight: heights.rightHeight,
        settle: {
          fontsReadyBudgetMs: FONTS_READY_BUDGET_MS,
          settleMs: SETTLE_MS,
          animationKill: true,
        },
        thresholdInertUnderCalibration: true,
        ...calibrated,
      },
      null,
      2,
    )}\n`,
  );
}

/** Analyse the live pair and calibrate it against the pooled null. */
function calibrateLivePair(
  config: CapturePairConfig,
  cropped: readonly Uint8Array[],
  height: number,
): Result<{ analysis: CalibratedPairAnalysis; liveLeft: Uint8Array; right: Uint8Array }, string> {
  const right = cropped.at(-1);
  const liveLeft = cropped[0];
  if (right === undefined || liveLeft === undefined) {
    return err('capture set was empty after cropping — report this');
  }
  const nullScores = poolNullScores(cropped.slice(0, -1), config.width, height, config.window);
  if (!nullScores.ok) {
    return nullScores;
  }
  const correlation = poolNullCorrelation(cropped.slice(0, -1), config.width, height);
  if (!correlation.ok) {
    return correlation;
  }
  const analysis = analysePair(liveLeft, right, config.width, height, {
    windowSize: config.window,
    threshold: config.threshold,
  });
  if (!analysis.ok) {
    return analysis;
  }
  const calibrated = calibrateAnalysis(analysis.value, nullScores.value, {
    correlation: correlation.value,
  });
  return calibrated.ok ? ok({ analysis: calibrated.value, liveLeft, right }) : calibrated;
}

/** Run the calibrated arm end to end and write the four outputs. The
 *  positional capture order ([left ×(k+1), right]) splits here into the
 *  self-describing record shape — downstream readers never decode
 *  positions. */
export async function runCalibrated(
  config: CapturePairConfig,
  nullRuns: number,
): Promise<Result<PairRunRecord<CalibratedPairAnalysis>, string>> {
  const captures = await captureAll(config, nullRuns);
  if (!captures.ok) {
    return captures;
  }
  const crops = cropAll(captures.value, config.width);
  if (!crops.ok) {
    return crops;
  }
  const [firstLeftHeight, ...restLeftHeights] = crops.value.heights.slice(0, -1);
  const rightHeight = crops.value.heights.at(-1);
  if (firstLeftHeight === undefined || rightHeight === undefined) {
    return err('capture set was empty after cropping — report this');
  }
  const leftHeights: [number, ...number[]] = [firstLeftHeight, ...restLeftHeights];
  const live = calibrateLivePair(config, crops.value.cropped, crops.value.height);
  if (!live.ok) {
    return live;
  }
  const pngs = writePairPngs(
    config,
    { left: live.value.liveLeft, right: live.value.right, height: crops.value.height },
    renderCalibratedHeatmap(live.value.liveLeft, config.width, live.value.analysis),
  );
  if (!pngs.ok) {
    return pngs;
  }
  writeCalibratedStats(config, nullRuns, { leftHeights, rightHeight }, live.value.analysis);
  return ok({ analysis: live.value.analysis, leftHeights, rightHeight });
}
