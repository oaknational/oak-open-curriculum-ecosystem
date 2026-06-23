import {
  BRAILLE_SHARP_FRAMES,
  OAK_LOGO_ROWS,
  resolveLogoRows,
  resolveLogoStyle,
} from '../../src/claude/oak-logo';

describe('OAK_LOGO_ROWS', () => {
  it('renders the default braille-sharp as five rows and every other style as four', () => {
    expect(OAK_LOGO_ROWS['braille-sharp']).toHaveLength(5);
    for (const style of ['braille-sharp-compact', 'braille', 'quad', 'sextant'] as const) {
      expect(OAK_LOGO_ROWS[style]).toHaveLength(4);
    }
  });

  it('keeps a uniform display width within each style', () => {
    for (const rows of Object.values(OAK_LOGO_ROWS)) {
      // Count Unicode code points (not UTF-16 units: sextant glyphs are astral
      // and would each count as two units). Every row in a style must share one
      // width so the segment column aligns; this assumes single-column glyph
      // rendering, per the note in oak-logo.ts.
      const widths = rows.map((row) => [...row].length);
      expect(new Set(widths).size).toBe(1);
    }
  });
});

describe('BRAILLE_SHARP_FRAMES', () => {
  it('opens the cycle on the active braille-sharp mark', () => {
    expect(BRAILLE_SHARP_FRAMES[0]).toEqual(OAK_LOGO_ROWS['braille-sharp']);
  });

  it('makes every frame distinct, so the cycle visibly varies', () => {
    const serialised = BRAILLE_SHARP_FRAMES.map((frame) => frame.join('\n'));
    expect(new Set(serialised).size).toBe(BRAILLE_SHARP_FRAMES.length);
  });

  it('keeps every frame aligned to the first frame (same row count and width)', () => {
    // Column alignment behaviour: whichever frame is selected, the segments to the
    // right stay aligned. Derived from frame 0, not pinned to specific dimensions.
    const [first, ...rest] = BRAILLE_SHARP_FRAMES;
    const width = (rows: readonly string[]): readonly number[] =>
      rows.map((row) => [...row].length);
    for (const frame of rest) {
      expect(frame).toHaveLength(first.length);
      expect(width(frame)).toEqual(width(first));
    }
  });
});

describe('resolveLogoRows', () => {
  it('drives braille-sharp from the frame counter, cycling back after the last frame', () => {
    // Delegation to the cycle engine (frameIndex is proven generically in its own
    // test); here we prove braille-sharp is wired to it and wraps by the frame count.
    expect(resolveLogoRows('braille-sharp', 1)).toEqual(BRAILLE_SHARP_FRAMES[1]);
    expect(resolveLogoRows('braille-sharp', BRAILLE_SHARP_FRAMES.length)).toEqual(
      BRAILLE_SHARP_FRAMES[0],
    );
  });

  it('ignores the frame for the single-mark styles', () => {
    for (const style of ['braille-sharp-compact', 'braille', 'quad', 'sextant'] as const) {
      expect(resolveLogoRows(style, 2)).toEqual(OAK_LOGO_ROWS[style]);
    }
  });
});

describe('resolveLogoStyle', () => {
  it('passes through the known styles', () => {
    expect(resolveLogoStyle('braille-sharp')).toBe('braille-sharp');
    expect(resolveLogoStyle('braille-sharp-compact')).toBe('braille-sharp-compact');
    expect(resolveLogoStyle('braille')).toBe('braille');
    expect(resolveLogoStyle('quad')).toBe('quad');
    expect(resolveLogoStyle('sextant')).toBe('sextant');
    expect(resolveLogoStyle('none')).toBe('none');
  });

  it('falls back to the default braille-sharp style for an unset or unrecognised value', () => {
    expect(resolveLogoStyle(undefined)).toBe('braille-sharp');
    expect(resolveLogoStyle('')).toBe('braille-sharp');
    expect(resolveLogoStyle('rainbow')).toBe('braille-sharp');
  });
});
