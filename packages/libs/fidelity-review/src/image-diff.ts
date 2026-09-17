/*
 * The perceptual diff core of the fidelity review: two PNG buffers in, a
 * diff PNG + changed-pixel ratio out. TRIAGE ONLY — the ratio prioritises
 * human/agent judgment and never gates anything (ratified: pixel-diff
 * triage, section-D acceptance stays human).
 *
 * Dimension mismatches are cropped to the common top-left intersection:
 * both sides are top-anchored full renders, so the top-left region is the
 * aligned one, and padding instead would count non-overlap as 100% diff and
 * drown the signal. The mismatch itself is carried as a caveat so the
 * report states what was and was not compared.
 *
 * Buffers in, buffers out — file IO stays in the orchestrator.
 */
import { err, ok, type Result } from '@oaknational/result';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

import { describeThrown } from './support';

interface Dimensions {
  readonly width: number;
  readonly height: number;
}

export interface DiffOutcome {
  /** Changed pixels / intersection pixels, in [0, 1]. */
  readonly changedRatio: number;
  /** Encoded PNG highlighting the changed pixels over the intersection. */
  readonly diffPng: Buffer;
  readonly exportDims: Dimensions;
  readonly liveDims: Dimensions;
  /** The compared region — the top-left intersection of both images. */
  readonly croppedTo: Dimensions;
  /** Triage caveats, e.g. `height-mismatch:+1240px` when sides differ. */
  readonly caveats: readonly string[];
}

/** Default pixelmatch sensitivity — an owner-tunable triage default, not a gate. */
const DEFAULT_THRESHOLD = 0.1;

/** Copy the top-left `crop` region of `source` into a fresh RGBA buffer. */
function cropTopLeft(source: PNG, crop: Dimensions): Uint8Array {
  const out = new Uint8Array(crop.width * crop.height * 4);
  for (let y = 0; y < crop.height; y += 1) {
    const sourceStart = y * source.width * 4;
    out.set(source.data.subarray(sourceStart, sourceStart + crop.width * 4), y * crop.width * 4);
  }
  return out;
}

/** Decode both PNG buffers, translating a decode throw into a failure Result. */
function decodePair(exportPng: Buffer, livePng: Buffer): Result<[PNG, PNG], string> {
  try {
    return ok([PNG.sync.read(exportPng), PNG.sync.read(livePng)]);
  } catch (error: unknown) {
    return err(`image-diff: could not decode PNG — ${describeThrown(error)}`);
  }
}

/** Name each axis on which the two sides disagree, signed live-minus-export. */
function dimensionCaveats(exportImage: PNG, liveImage: PNG): readonly string[] {
  const caveats: string[] = [];
  for (const [axis, delta] of [
    ['height', liveImage.height - exportImage.height],
    ['width', liveImage.width - exportImage.width],
  ] as const) {
    if (delta !== 0) {
      caveats.push(`${axis}-mismatch:${delta > 0 ? '+' : ''}${delta}px`);
    }
  }
  return caveats;
}

/** Diff two PNG buffers over their common top-left intersection. */
export function diffPngs(
  exportPng: Buffer,
  livePng: Buffer,
  options?: { readonly threshold?: number },
): Result<DiffOutcome, string> {
  const decoded = decodePair(exportPng, livePng);
  if (!decoded.ok) {
    return decoded;
  }
  const [exportImage, liveImage] = decoded.value;

  const croppedTo: Dimensions = {
    width: Math.min(exportImage.width, liveImage.width),
    height: Math.min(exportImage.height, liveImage.height),
  };
  if (croppedTo.width === 0 || croppedTo.height === 0) {
    return err('image-diff: empty intersection — one image has a zero dimension');
  }

  const diff = new PNG({ width: croppedTo.width, height: croppedTo.height });
  const changed = pixelmatch(
    cropTopLeft(exportImage, croppedTo),
    cropTopLeft(liveImage, croppedTo),
    diff.data,
    croppedTo.width,
    croppedTo.height,
    { threshold: options?.threshold ?? DEFAULT_THRESHOLD },
  );

  return ok({
    changedRatio: changed / (croppedTo.width * croppedTo.height),
    diffPng: PNG.sync.write(diff),
    exportDims: { width: exportImage.width, height: exportImage.height },
    liveDims: { width: liveImage.width, height: liveImage.height },
    croppedTo,
    caveats: dimensionCaveats(exportImage, liveImage),
  });
}
