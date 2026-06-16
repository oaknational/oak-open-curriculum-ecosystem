import { OAK_LOGO_ROWS, resolveLogoStyle } from '../../src/claude/oak-logo';

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
