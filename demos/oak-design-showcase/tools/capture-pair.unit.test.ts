/**
 * The argument boundary's contract: canonical widths only (DDR-009's
 * enforcement seam reused verbatim), required flags named in the error,
 * and defaults that match the DDR-010 method (32px windows, six sigma).
 */
import { describe, expect, it } from 'vitest';

import { parseCapturePairArgs } from './capture-pair-args';

const BASE = ['--left', 'http://localhost:1/a', '--right', 'http://localhost:1/b', '--out', 'x'];

describe('parseCapturePairArgs', () => {
  it('accepts a canonical width and applies the method defaults', () => {
    const result = parseCapturePairArgs([...BASE, '--width', '1280']);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.width).toBe(1280);
      expect(result.value.window).toBe(32);
      expect(result.value.threshold).toBe(6);
      expect(result.value.tag).toBe('pair');
    }
  });

  it('refuses a free-hand width with the canonical set in the message', () => {
    const result = parseCapturePairArgs([...BASE, '--width', '1000']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('DDR-009');
    }
  });

  it('names the required flags when one is missing', () => {
    const result = parseCapturePairArgs(['--left', 'a', '--width', '1280']);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('--right');
    }
  });

  it('refuses an unpaired flag sequence', () => {
    expect(parseCapturePairArgs([...BASE, '--width']).ok).toBe(false);
  });

  it('accepts --null-runs at or above the two-capture floor and carries it', () => {
    const result = parseCapturePairArgs([...BASE, '--width', '1280', '--null-runs', '6']);
    expect(result.ok && result.value.nullRuns === 6).toBe(true);
    const absent = parseCapturePairArgs([...BASE, '--width', '1280']);
    expect(absent.ok && absent.value.nullRuns === undefined).toBe(true);
  });

  it('rejects --null-runs below two or non-integer', () => {
    for (const bad of ['1', '0', '-3', '2.5', 'six']) {
      expect(parseCapturePairArgs([...BASE, '--width', '1280', '--null-runs', bad]).ok).toBe(false);
    }
  });
});
