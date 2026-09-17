import { describe, expect, it } from 'vitest';

import { isRenderSuspect, isRequiredResourceFailure } from './capture-checks';

/* resolveWidth/resolveBase/isSuspect behaviour is proven in
 * @oaknational/fidelity-review's capture-flags suite; this file owns the
 * showcase's frame-aware render classification. */

describe('isRenderSuspect', () => {
  it('accepts a healthy unframed page', () => {
    expect(
      isRenderSuspect(
        {
          status: 200,
          bodyHeight: 5949,
          textLength: 3544,
          frameTextLength: undefined,
        },
        false,
      ),
    ).toBe(false);
  });

  it('flags an unframed page that fails the generic blank thresholds', () => {
    expect(
      isRenderSuspect(
        { status: 200, bodyHeight: 120, textLength: 40, frameTextLength: undefined },
        false,
      ),
    ).toBe(true);
    expect(
      isRenderSuspect(
        { status: 404, bodyHeight: 5949, textLength: 3544, frameTextLength: undefined },
        false,
      ),
    ).toBe(true);
  });
});

describe('isRenderSuspect on framed pages', () => {
  it('counts a healthy frame toward a thin parent — the picker chrome shape', () => {
    // The picker page's own text sits above the threshold only barely; its
    // iframe's specimen text carries the rest.
    expect(
      isRenderSuspect(
        { status: 200, bodyHeight: 1297, textLength: 190, frameTextLength: 3544 },
        true,
      ),
    ).toBe(false);
  });

  it('flags a framed page whose frame is empty even when the parent is healthy', () => {
    // The wrong-target class the generic classifier cannot see: healthy
    // chrome around a specimen that never loaded.
    expect(
      isRenderSuspect({ status: 200, bodyHeight: 1297, textLength: 383, frameTextLength: 0 }, true),
    ).toBe(true);
  });

  it('flags a page expected to host a frame that renders none — healthy chrome around an unmounted specimen', () => {
    expect(
      isRenderSuspect(
        { status: 200, bodyHeight: 1297, textLength: 383, frameTextLength: undefined },
        true,
      ),
    ).toBe(true);
  });
});

describe('isRequiredResourceFailure', () => {
  const BASE = 'http://127.0.0.1:4173';

  it.each([
    [
      'a same-origin stylesheet 404 — the silent-unstyle class',
      'stylesheet',
      `${BASE}/styles.css`,
      404,
      true,
    ],
    ['a same-origin script 404', 'script', `${BASE}/app.js`, 404, true],
    [
      'a same-origin font network failure (no status — destroyed socket)',
      'font',
      `${BASE}/fonts/Lexend.ttf`,
      undefined,
      true,
    ],
    [
      'a same-origin image 404 — the diff itself surfaces changed pixels',
      'image',
      `${BASE}/logo.png`,
      404,
      false,
    ],
    ["Chromium's automatic favicon probe (type other)", 'other', `${BASE}/favicon.ico`, 404, false],
    [
      'a cross-origin stylesheet 404 — not evidence the export tree is mis-served',
      'stylesheet',
      'https://elsewhere.example/styles.css',
      404,
      false,
    ],
    [
      'a same-origin stylesheet that served cleanly',
      'stylesheet',
      `${BASE}/styles.css`,
      200,
      false,
    ],
  ] as const)('judges %s', (_label, resourceType, url, status, expected) => {
    expect(isRequiredResourceFailure(resourceType, url, BASE, status)).toBe(expected);
  });
});
