import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import { describe, expect, it } from 'vitest';

import { buildCatalogue, type DtcgTree } from '../token-catalogue';
import { loadCatalogue } from '../token-source';
import {
  MATRIX_THEMES,
  asHexColour,
  bandId,
  colourTokens,
  frameTitle,
  resolveMatrixTheme,
  stripHref,
} from './colour-matrix';

/**
 * The matrix is fifteen frames addressed by query string, so the things
 * worth pinning are the address, the name a person hears, and the colour a
 * person reads. A wrong href renders a plausible-looking cell of the WRONG
 * combination, which is the one failure a matrix cannot survive: it would
 * be quietly, confidently incorrect.
 */

function tree(file: string, tier: 1 | 2 | 3, theme: string | null, data: unknown): DtcgTree {
  return { file, tier, theme, data };
}

describe('MATRIX_THEMES', () => {
  it('leads with the identity default, which is the absence of a theme', () => {
    expect(MATRIX_THEMES[0]?.id).toBe(IDENTITY_DEFAULT);
  });

  it('leaves out match-device, which is an instruction rather than a face', () => {
    // A `system` column would duplicate whichever of light or dark the
    // machine happens to be in, and would change under the reader.
    expect(MATRIX_THEMES.map((theme) => theme.id)).not.toContain('system');
  });

  it('shows the four real faces alongside it', () => {
    expect(MATRIX_THEMES.map((theme) => theme.id)).toEqual([
      IDENTITY_DEFAULT,
      'light',
      'dark',
      'high-contrast',
      'colour-safe',
    ]);
  });
});

describe('resolveMatrixTheme', () => {
  it('accepts every theme the matrix shows', () => {
    for (const theme of MATRIX_THEMES) {
      expect(resolveMatrixTheme(theme.id)).toBe(theme.id);
    }
  });

  it('falls back to the identity default for anything else', () => {
    expect(resolveMatrixTheme('system')).toBe(IDENTITY_DEFAULT);
    expect(resolveMatrixTheme('nonsense')).toBe(IDENTITY_DEFAULT);
    expect(resolveMatrixTheme(undefined)).toBe(IDENTITY_DEFAULT);
    expect(resolveMatrixTheme(['dark', 'light'])).toBe('dark');
  });
});

describe('stripHref', () => {
  it('addresses a cell by both axes, so a frame cannot render the wrong pair', () => {
    expect(stripHref('creature', 'dark')).toBe('/tokens/colours/strip?brand=creature&theme=dark');
    expect(stripHref('oak', IDENTITY_DEFAULT)).toBe(
      '/tokens/colours/strip?brand=oak&theme=identity-default',
    );
  });

  it('round-trips through the resolver the strip route uses', () => {
    const href = stripHref('pds', 'high-contrast');
    const theme = new URL(href, 'https://example.test').searchParams.get('theme');
    expect(resolveMatrixTheme(theme ?? undefined)).toBe('high-contrast');
  });
});

describe('frameTitle', () => {
  it('names both axes, because fifteen frames need telling apart', () => {
    expect(frameTitle('Oak', 'Dark')).toBe('Oak — Dark');
  });
});

describe('bandId', () => {
  it('gives each band a heading id its section can be labelled by', () => {
    expect(bandId('dark')).toBe('colours-dark');
    expect(bandId(IDENTITY_DEFAULT)).toBe('colours-identity-default');
  });
});

describe('colourTokens', () => {
  it('takes the catalogue’s colour area and nothing else', () => {
    const catalogue = buildCatalogue([
      tree('semantic.light.json', 2, 'light', {
        text: { primary: { $value: '#000', $type: 'color' } },
        space: { 16: { $value: '16px', $type: 'dimension' } },
      }),
    ]);
    expect(colourTokens(catalogue.tokens).map((token) => token.name)).toEqual(['--text-primary']);
  });

  it('agrees with the reference page about what the published colour area is', () => {
    // One definition, two pages: the matrix cannot show a different set of
    // colours from the section the reference page files under Colour.
    const tokens = colourTokens(loadCatalogue().tokens);
    expect(tokens.length).toBeGreaterThan(100);
    expect(tokens.every((token) => token.name.startsWith('--'))).toBe(true);
  });

  it('leads with the roles an identity re-points, not the palette beneath them', () => {
    // A comparison page whose first screenful is the same swatch in all
    // three columns has buried its own story: the palette is invariant, the
    // roles are where identities differ.
    const tiers = colourTokens(loadCatalogue().tokens).map((token) => token.tier);
    const firstPrimitive = tiers.indexOf(1);
    expect(firstPrimitive).toBeGreaterThan(0);
    expect(tiers.slice(firstPrimitive).every((tier) => tier === 1)).toBe(true);
  });

  it('keeps catalogue order within each half rather than inventing a sort', () => {
    const catalogue = buildCatalogue([
      tree('palette.json', 1, null, {
        oak: { color: { white: { $value: '#fff', $type: 'color' } } },
      }),
      tree('semantic.light.json', 2, 'light', {
        text: { primary: { $value: '#000', $type: 'color' } },
        bg: { primary: { $value: '#fff', $type: 'color' } },
      }),
    ]);
    expect(colourTokens(catalogue.tokens).map((token) => token.name)).toEqual([
      '--text-primary',
      '--bg-primary',
      '--oak-white',
    ]);
  });
});

describe('asHexColour', () => {
  it('writes a browser’s used colour the way a designer compares one', () => {
    expect(asHexColour('rgb(255, 255, 255)')).toBe('#ffffff');
    expect(asHexColour('rgb(34, 34, 34)')).toBe('#222222');
    expect(asHexColour('rgb(0, 0, 0)')).toBe('#000000');
  });

  it('carries alpha through rather than dropping it', () => {
    // A state overlay that is half transparent is not the same colour as
    // the opaque one, and a matrix that printed them alike would lie.
    expect(asHexColour('rgba(0, 0, 0, 0.5)')).toBe('#00000080');
    expect(asHexColour('rgba(255, 255, 255, 1)')).toBe('#ffffff');
  });

  it('accepts the space-and-slash form browsers also emit', () => {
    expect(asHexColour('rgb(17 34 51 / 0.5)')).toBe('#11223380');
  });

  it('returns anything it cannot parse unchanged, rather than mangling it', () => {
    // Showing the browser's own words always beats a wrong conversion.
    expect(asHexColour('color(srgb 0.1 0.2 0.3)')).toBe('color(srgb 0.1 0.2 0.3)');
    expect(asHexColour('transparent')).toBe('transparent');
    expect(asHexColour('')).toBe('');
  });
});
