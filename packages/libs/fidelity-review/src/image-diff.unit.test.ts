import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';

import { diffPngs } from './image-diff';

/** Build an in-memory PNG buffer filled with one RGBA colour. */
function solidPng(
  width: number,
  height: number,
  rgba: readonly [number, number, number, number],
): Buffer {
  const png = new PNG({ width, height });
  for (let index = 0; index < width * height; index += 1) {
    png.data[index * 4] = rgba[0];
    png.data[index * 4 + 1] = rgba[1];
    png.data[index * 4 + 2] = rgba[2];
    png.data[index * 4 + 3] = rgba[3];
  }
  return PNG.sync.write(png);
}

describe('diffPngs on matched dimensions', () => {
  it('reports zero changed pixels for identical images', () => {
    const image = solidPng(10, 10, [255, 255, 255, 255]);

    const result = diffPngs(image, solidPng(10, 10, [255, 255, 255, 255]));

    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      expect(result.value.changedRatio).toBe(0);
      expect(result.value.caveats).toHaveLength(0);
      expect(result.value.croppedTo).toStrictEqual({ width: 10, height: 10 });
    }
  });

  it('reports the exact changed ratio for a fully different image', () => {
    const white = solidPng(10, 10, [255, 255, 255, 255]);
    const black = solidPng(10, 10, [0, 0, 0, 255]);

    const result = diffPngs(white, black);

    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      expect(result.value.changedRatio).toBe(1);
    }
  });

  it('returns a failure Result for a buffer that is not a PNG', () => {
    const result = diffPngs(Buffer.from('not a png'), solidPng(4, 4, [0, 0, 0, 255]));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('image-diff');
    }
  });
});

describe('diffPngs on mismatched dimensions', () => {
  it('crops to the common intersection and says so', () => {
    const tall = solidPng(10, 30, [255, 255, 255, 255]);
    const short = solidPng(10, 10, [255, 255, 255, 255]);

    const result = diffPngs(tall, short);

    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      expect(result.value.croppedTo).toStrictEqual({ width: 10, height: 10 });
      expect(result.value.exportDims).toStrictEqual({ width: 10, height: 30 });
      expect(result.value.liveDims).toStrictEqual({ width: 10, height: 10 });
      expect(result.value.caveats.some((caveat) => caveat.includes('height-mismatch'))).toBe(true);
      expect(result.value.changedRatio).toBe(0);
    }
  });

  it('emits a diff image sized to the cropped intersection', () => {
    const white = solidPng(8, 12, [255, 255, 255, 255]);
    const black = solidPng(8, 6, [0, 0, 0, 255]);

    const result = diffPngs(white, black);

    expect(result.ok ? undefined : result.error).toBeUndefined();
    if (result.ok) {
      const decoded = PNG.sync.read(result.value.diffPng);
      expect({ width: decoded.width, height: decoded.height }).toStrictEqual({
        width: 8,
        height: 6,
      });
    }
  });
});
