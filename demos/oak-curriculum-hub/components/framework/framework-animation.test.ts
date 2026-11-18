import { describe, expect, it } from 'vitest';

import { polar, chevronPath, walkStageIndex } from '@/components/framework/framework-animation';

describe('polar', () => {
  it('maps an angle on a circle to a cartesian point (0deg = right, 90deg = down)', () => {
    const [x0, y0] = polar(100, 100, 50, 0);
    expect(x0).toBeCloseTo(150);
    expect(y0).toBeCloseTo(100);
    const [x90, y90] = polar(100, 100, 50, 90);
    expect(x90).toBeCloseTo(100);
    expect(y90).toBeCloseTo(150);
  });

  it('returns fixed-precision coordinates so server and client serialise identically', () => {
    // Math.cos/sin are not spec-pinned: engines may differ in the last ulp, and a raw double
    // serialised into an SVG attribute then hydration-mismatches. 2dp is sub-pixel on the 500-unit
    // ring canvas.
    const [x, y] = polar(250, 250, 118, -107.143);
    expect(x).toBe(Math.round(x * 100) / 100);
    expect(y).toBe(Math.round(y * 100) / 100);
  });
});

describe('chevronPath', () => {
  it('produces a closed SVG path with two arcs (a chevron ring band)', () => {
    const d = chevronPath({
      cx: 100,
      cy: 100,
      innerR: 40,
      outerR: 80,
      startDeg: 0,
      endDeg: 40,
      pointDeg: 8,
    });
    expect(d.startsWith('M')).toBe(true);
    expect(d.trimEnd().endsWith('Z')).toBe(true);
    expect(d.match(/A/g) ?? []).toHaveLength(2);
  });

  it('serialises every coordinate at fixed precision (no engine-dependent double tails)', () => {
    const d = chevronPath({
      cx: 250,
      cy: 250,
      innerR: 118,
      outerR: 232,
      startDeg: -150,
      endDeg: -107.5,
      pointDeg: 18,
    });
    // One digit, the point, three digits: a run of three or more decimals
    // always contains this, and the bounded form cannot backtrack
    // (sonarjs/super-linear-regex on the earlier `\d+\.\d{3,}`).
    expect(/\d\.\d{3}/.test(d)).toBe(false);
  });
});

describe('walkStageIndex', () => {
  it('advances one stage per interval and wraps back to the first', () => {
    expect(walkStageIndex(0, 1000, 7)).toBe(0);
    expect(walkStageIndex(1500, 1000, 7)).toBe(1);
    expect(walkStageIndex(6999, 1000, 7)).toBe(6);
    expect(walkStageIndex(7000, 1000, 7)).toBe(0);
  });

  it('is defensive against a non-positive interval or empty stage set', () => {
    expect(walkStageIndex(5000, 0, 7)).toBe(0);
    expect(walkStageIndex(5000, 1000, 0)).toBe(0);
  });
});
