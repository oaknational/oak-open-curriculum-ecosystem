/** Roundtrip and refusal states of the codec boundary. */
import { describe, expect, it } from 'vitest';

import { cropToHeight, decodePng, encodePng } from './png-codec';

describe('png codec', () => {
  it('roundtrips an RGBA buffer through encode and decode', () => {
    const rgba = new Uint8Array(4 * 4 * 4);
    for (let i = 0; i < rgba.length; i += 4) {
      rgba[i] = 10;
      rgba[i + 1] = 20;
      rgba[i + 2] = 30;
      rgba[i + 3] = 255;
    }
    const encoded = encodePng(rgba, 4, 4);
    expect(encoded.ok).toBe(true);
    if (!encoded.ok) {
      return;
    }
    const decoded = decodePng(encoded.value);
    expect(decoded.ok).toBe(true);
    if (!decoded.ok) {
      return;
    }
    expect(decoded.value.width).toBe(4);
    expect(decoded.value.height).toBe(4);
    expect(Array.from(decoded.value.rgba)).toEqual(Array.from(rgba));
  });

  it('refuses a non-PNG buffer through the Result channel', () => {
    expect(decodePng(new Uint8Array([1, 2, 3])).ok).toBe(false);
  });

  it('refuses an encode whose buffer disagrees with the dimensions', () => {
    expect(encodePng(new Uint8Array(8), 4, 4).ok).toBe(false);
  });

  it('crops from the top and refuses to grow', () => {
    const rgba = new Uint8Array(2 * 3 * 4).map((_, i) => i % 251);
    const cropped = cropToHeight(rgba, 2, 3, 2);
    expect(cropped.ok).toBe(true);
    if (cropped.ok) {
      expect(cropped.value.length).toBe(2 * 2 * 4);
      expect(Array.from(cropped.value)).toEqual(Array.from(rgba.slice(0, 16)));
    }
    expect(cropToHeight(rgba, 2, 3, 4).ok).toBe(false);
  });
});
