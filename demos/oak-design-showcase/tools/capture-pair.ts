/**
 * Capture a reference/rebuild pair at a canonical width and run the
 * windowed rejection statistics over it (DDR-010: comparison is visual
 * first; the statistics direct the looking). Writes, under --out:
 * `<tag>-{left,right,heatmap}.png` (left = rebuild, right = reference,
 * heatmap = left with rejecting windows tinted red) plus
 * `<tag>-stats.json`; the stdout summary names the causal frontier and
 * top rejecting regions with σ-scores so a reader (human or LLM) starts
 * where the evidence points. Widths are canonical only (DDR-009's seam).
 *
 *   pnpm exec tsx tools/capture-pair.ts --left <url> --right <url>
 *     --width 1280 --out <dir> [--tag pair] [--window 32] [--threshold 6]
 *     [--null-runs 6]
 *
 * With `--null-runs k` (S2a, DDR-010 §Known limits) the left url is
 * repeat-captured k extra times to build a same-page empirical null and
 * the pair is CALIBRATED against it: empirical p per window, an honest
 * σ that saturates at the null's resolution, rejection = beyond the
 * observed null maximum — and `--threshold` goes inert (stated in the
 * output). Every capture, null or live, traverses the estate settle
 * recipe identically.
 *
 * (Invoke via `pnpm exec tsx`, not `pnpm run … -- …`: pnpm's run
 * passthrough swallows the leading `--left` flag.)
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { cropToHeight } from '@oaknational/fidelity-review/png-codec';
import {
  analysePair,
  renderHeatmapOverlay,
  type PairAnalysis,
} from '@oaknational/fidelity-review/visual-stats';
import {
  captureRgba,
  writePairPngs,
  type CapturePairConfig,
  type PairRunRecord,
} from './capture-shared';
import { parseCapturePairArgs } from './capture-pair-args';
import { runCalibrated } from './capture-null';
import { summariseCalibrated, summariseNaive } from './capture-summary';

export { parseCapturePairArgs } from './capture-pair-args';

/** Both captures cropped to their common height; the PRE-CROP heights
 *  ride the result so no output is silent about a truncated tail. */
async function captureBoth(config: CapturePairConfig): Promise<
  Result<
    {
      left: Uint8Array;
      right: Uint8Array;
      height: number;
      leftHeight: number;
      rightHeight: number;
    },
    string
  >
> {
  const left = await captureRgba(config.left, config.width);
  if (!left.ok) {
    return err(`left: ${left.error}`);
  }
  const right = await captureRgba(config.right, config.width);
  if (!right.ok) {
    return err(`right: ${right.error}`);
  }
  const height = Math.min(left.value.height, right.value.height);
  const leftCrop = cropToHeight(left.value.rgba, config.width, left.value.height, height);
  const rightCrop = cropToHeight(right.value.rgba, config.width, right.value.height, height);
  if (!leftCrop.ok || !rightCrop.ok) {
    return err('crop refused a capture the codec accepted — report this');
  }
  return ok({
    left: leftCrop.value,
    right: rightCrop.value,
    height,
    leftHeight: left.value.height,
    rightHeight: right.value.height,
  });
}

/** Analyse the cropped pair and write the four outputs (naive arm). The
 *  stats record carries the pre-crop heights alongside the analysis —
 *  heights are capture-layer facts, so they live here, never in the
 *  library's PairAnalysis. */
function analyseAndWrite(
  config: CapturePairConfig,
  pair: {
    readonly left: Uint8Array;
    readonly right: Uint8Array;
    readonly height: number;
    readonly leftHeight: number;
    readonly rightHeight: number;
  },
): Result<PairRunRecord<PairAnalysis>, string> {
  const analysis = analysePair(pair.left, pair.right, config.width, pair.height, {
    windowSize: config.window,
    threshold: config.threshold,
  });
  if (!analysis.ok) {
    return analysis;
  }
  const pngs = writePairPngs(
    config,
    pair,
    renderHeatmapOverlay(pair.left, config.width, analysis.value),
  );
  if (!pngs.ok) {
    return pngs;
  }
  const record: PairRunRecord<PairAnalysis> = {
    analysis: analysis.value,
    leftHeights: [pair.leftHeight],
    rightHeight: pair.rightHeight,
  };
  writeFileSync(
    join(config.out, `${config.tag}-stats.json`),
    `${JSON.stringify(
      {
        left: config.left,
        right: config.right,
        leftHeights: record.leftHeights,
        rightHeight: record.rightHeight,
        ...analysis.value,
      },
      null,
      2,
    )}\n`,
  );
  return ok(record);
}

async function runNaive(config: CapturePairConfig): Promise<Result<string, string>> {
  const pair = await captureBoth(config);
  if (!pair.ok) {
    return pair;
  }
  const record = analyseAndWrite(config, pair.value);
  return record.ok ? ok(summariseNaive(record.value)) : record;
}

async function main(): Promise<number> {
  const config = parseCapturePairArgs(process.argv.slice(2));
  if (!config.ok) {
    process.stderr.write(`capture-pair: ${config.error}\n`);
    return 2;
  }
  const { nullRuns, tag, out } = config.value;
  let summary: Result<string, string>;
  if (nullRuns === undefined) {
    summary = await runNaive(config.value);
  } else {
    const run = await runCalibrated(config.value, nullRuns);
    summary = run.ok ? ok(summariseCalibrated(run.value)) : run;
  }
  if (!summary.ok) {
    process.stderr.write(`capture-pair: ${summary.error}\n`);
    return 1;
  }
  process.stdout.write(
    `${summary.value}\ncapture-pair: wrote ${tag}-{left,right,heatmap}.png + ${tag}-stats.json to ${out}\n`,
  );
  return 0;
}

const isDirectRun = process.argv[1]?.endsWith('capture-pair.ts') === true;
if (isDirectRun) {
  try {
    process.exitCode = await main();
  } catch (error: unknown) {
    process.stderr.write(
      `capture-pair: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  }
}
