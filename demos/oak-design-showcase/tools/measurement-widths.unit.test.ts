/**
 * The canonical width set's structural invariants: the floor is the WCAG
 * reflow width, the kit's one seam is bracketed, entries are unique and
 * ascending, and every width carries its warrant. A drift in any of these
 * is a change to what "measured" means estate-wide, and should be loud.
 */
import { describe, expect, it } from 'vitest';

import {
  MEASUREMENT_WIDTHS,
  MEASUREMENT_WIDTH_VALUES,
  assertCanonicalWidth,
} from './measurement-widths';

const KIT_WIDTH_SEAM = 840;

describe('the canonical measurement widths', () => {
  it('start at the WCAG 1.4.10 reflow floor', () => {
    expect(MEASUREMENT_WIDTH_VALUES[0]).toBe(320);
  });

  it('are unique and strictly ascending', () => {
    const sorted = [...MEASUREMENT_WIDTH_VALUES].sort((a, b) => a - b);
    expect(MEASUREMENT_WIDTH_VALUES).toStrictEqual(sorted);
    expect(new Set(MEASUREMENT_WIDTH_VALUES).size).toBe(MEASUREMENT_WIDTH_VALUES.length);
  });

  it("bracket the kit's single width seam from both sides", () => {
    expect(MEASUREMENT_WIDTH_VALUES.some((width) => width < KIT_WIDTH_SEAM)).toBe(true);
    expect(MEASUREMENT_WIDTH_VALUES.some((width) => width > KIT_WIDTH_SEAM)).toBe(true);
  });

  it('every width names the failure class it exists to catch', () => {
    for (const entry of MEASUREMENT_WIDTHS) {
      expect(entry.warrant.length).toBeGreaterThan(20);
      expect(entry.label).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it('include the export design canvas as the primary comparison cell', () => {
    expect(MEASUREMENT_WIDTH_VALUES).toContain(1440);
  });
});

describe('assertCanonicalWidth (the DDR-009 enforcement seam)', () => {
  it('accepts every canonical width', () => {
    for (const width of MEASUREMENT_WIDTH_VALUES) {
      expect(assertCanonicalWidth(width)).toStrictEqual({ ok: true, value: width });
    }
  });

  it('refuses a free-hand width, and the cure is in the message', () => {
    const result = assertCanonicalWidth(1337);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('DDR-009');
      expect(result.error).toContain('1440');
    }
  });
});
