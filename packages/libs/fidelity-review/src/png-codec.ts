/**
 * Thin PNG codec over the package's pngjs dependency, so tool-side
 * consumers of the visual statistics (which are pure buffer-in/record-out)
 * can decode captures and encode overlays without growing their own pixel
 * dependency — the package is the estate's one home for pixel machinery.
 */
import { PNG } from 'pngjs';

import { err, ok, type Result } from '@oaknational/result';

export interface DecodedImage {
  readonly width: number;
  readonly height: number;
  readonly rgba: Uint8Array;
}

export function decodePng(buffer: Uint8Array): Result<DecodedImage, string> {
  try {
    const png = PNG.sync.read(Buffer.from(buffer));
    return ok({ width: png.width, height: png.height, rgba: Uint8Array.from(png.data) });
  } catch (error) {
    return err(`not a decodable PNG: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function encodePng(
  rgba: Uint8Array,
  width: number,
  height: number,
): Result<Uint8Array, string> {
  if (rgba.length !== width * height * 4) {
    return err(
      `buffer length ${rgba.length} is not width×height×4 (${width}×${height}×4 = ${width * height * 4})`,
    );
  }
  const png = new PNG({ width, height });
  png.data = Buffer.from(rgba);
  return ok(Uint8Array.from(PNG.sync.write(png)));
}

/** Crop an RGBA buffer to a new height from the top (pairs are compared
 *  over their common extent; page tails of different lengths are not a
 *  divergence signal). */
export function cropToHeight(
  rgba: Uint8Array,
  width: number,
  height: number,
  newHeight: number,
): Result<Uint8Array, string> {
  if (newHeight > height) {
    return err(`cannot crop ${height}px to a taller ${newHeight}px`);
  }
  return ok(rgba.slice(0, width * newHeight * 4));
}
