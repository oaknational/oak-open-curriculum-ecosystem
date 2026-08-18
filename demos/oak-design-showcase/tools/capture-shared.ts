/**
 * Capture machinery shared by capture-pair's two arms (the naive pair
 * and the `--null-runs` calibrated arm). One capture path only: every
 * shot goes through the estate settle recipe (captureShot — bounded
 * fonts wait, animation kill, fixed settle), because the null's meaning
 * rests on null and live captures traversing the IDENTICAL path.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { chromium } from '@playwright/test';

import { err, ok, type Result } from '@oaknational/result';
import { captureShot } from '@oaknational/fidelity-review/capture-settle';
import { decodePng, encodePng } from '@oaknational/fidelity-review/png-codec';

export interface CapturePairConfig {
  readonly left: string;
  readonly right: string;
  readonly width: number;
  readonly out: string;
  readonly tag: string;
  readonly window: number;
  readonly threshold: number;
  /** Present = the calibrated arm: repeat-capture the left url this
   *  many extra times and build the empirical null (S2a). */
  readonly nullRuns?: number;
}

/** One arm's run record: the analysis plus every PRE-CROP height (the
 *  naive arm carries one left height; the calibrated arm k+1 — never
 *  empty, by type). A capture-layer data shape, homed here beside the
 *  capture config; the summary printer consumes it, never defines it. */
export interface PairRunRecord<Analysis> {
  readonly analysis: Analysis;
  readonly leftHeights: readonly [number, ...number[]];
  readonly rightHeight: number;
}

/** One settled capture in a fresh browser — the single capture path. */
export async function captureRgba(
  url: string,
  width: number,
): Promise<Result<{ rgba: Uint8Array; height: number }, string>> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    await page.goto(url, { waitUntil: 'load' });
    const shot = await captureShot(page, { fullPage: true });
    const decoded = decodePng(shot);
    if (!decoded.ok) {
      return err(`${url}: ${decoded.error}`);
    }
    return ok({ rgba: decoded.value.rgba, height: decoded.value.height });
  } finally {
    await browser.close();
  }
}

/** Write the three PNGs (left, right, heatmap) under config.out. */
export function writePairPngs(
  config: CapturePairConfig,
  pair: { readonly left: Uint8Array; readonly right: Uint8Array; readonly height: number },
  heatmap: Uint8Array,
): Result<undefined, string> {
  const { width, out, tag } = config;
  mkdirSync(out, { recursive: true });
  const writes: (readonly [string, Result<Uint8Array, string>])[] = [
    [`${tag}-left.png`, encodePng(pair.left, width, pair.height)],
    [`${tag}-right.png`, encodePng(pair.right, width, pair.height)],
    [`${tag}-heatmap.png`, encodePng(heatmap, width, pair.height)],
  ];
  for (const [name, encoded] of writes) {
    if (!encoded.ok) {
      return err(`${name}: ${encoded.error}`);
    }
    writeFileSync(join(out, name), encoded.value);
  }
  return ok(undefined);
}
