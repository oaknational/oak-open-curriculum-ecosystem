import { describe, expect, it } from 'vitest';

import {
  flattenTokenPath,
  isIconUrlProperty,
  soleReference,
  withVarReferences,
} from './token-names';

/**
 * A wrong name here is not a wrong label — it is a swatch bound to a
 * property that does not exist, painting nothing and reading back empty. So
 * what these tests hold is the flattening contract and both of its
 * exceptions, including the one the kit's own README does not record.
 */

describe('flattenTokenPath', () => {
  it('joins path segments with hyphens, the documented round-trip', () => {
    expect(flattenTokenPath('text.primary')).toBe('--text-primary');
    expect(flattenTokenPath('btn.min-h')).toBe('--btn-min-h');
    expect(flattenTokenPath('surface.decorative-1-soft')).toBe('--surface-decorative-1-soft');
  });

  it('drops the colour segment for palette paths, which the CSS declares as --oak-<name>', () => {
    // dtcg/README.md "Prefix delta": the paths were shaped for another
    // consumer's palette inliner; this kit's CSS declares --oak-white.
    expect(flattenTokenPath('oak.color.white')).toBe('--oak-white');
    expect(flattenTokenPath('oak.color.black-true')).toBe('--oak-black-true');
  });

  it('drops the family segment for font families, which the CSS declares as --font-<name>', () => {
    // NOT recorded in dtcg/README.md, which claims the flattening
    // "round-trips our CSS names exactly". Found by checking every
    // flattened name against the kit's declarations: these three had no
    // property to bind to.
    expect(flattenTokenPath('font.family.sans')).toBe('--font-sans');
    expect(flattenTokenPath('font.family.mono')).toBe('--font-mono');
    expect(flattenTokenPath('font.family.display')).toBe('--font-display');
  });

  it('leaves the font size scale alone, which shares the prefix but not the exception', () => {
    expect(flattenTokenPath('font.size.7')).toBe('--font-size-7');
  });
});

describe('isIconUrlProperty', () => {
  it('names both icon URL shapes and nothing that merely begins alike', () => {
    expect(isIconUrlProperty('--i-search')).toBe(true);
    expect(isIconUrlProperty('--ic-search')).toBe(true);
    expect(isIconUrlProperty('--input-min-h')).toBe(false);
    expect(isIconUrlProperty('--inset-s')).toBe(false);
    expect(isIconUrlProperty('--icon-src')).toBe(false);
  });
});

describe('withVarReferences', () => {
  it('rewrites a reference as the var() call the CSS holds', () => {
    expect(withVarReferences('{oak.color.black}')).toBe('var(--oak-black)');
  });

  it('rewrites every reference in a composite value and keeps the rest verbatim', () => {
    expect(withVarReferences('0 0.5rem 0.5rem {oak.color.shadow-veil}')).toBe(
      '0 0.5rem 0.5rem var(--oak-shadow-veil)',
    );
    expect(withVarReferences('calc({density}*{space.24})')).toBe(
      'calc(var(--density)*var(--space-24))',
    );
  });

  it('leaves a value with no references untouched', () => {
    expect(withVarReferences('#ffffff')).toBe('#ffffff');
  });
});

describe('soleReference', () => {
  it('names the referent when the value is exactly one reference', () => {
    expect(soleReference('{size.target}')).toBe('--size-target');
    expect(soleReference('  {size.target}  ')).toBe('--size-target');
  });

  it('reports nothing when the value composes a reference with anything else', () => {
    expect(soleReference('calc({size.icon-m} + {space.4})')).toBeNull();
    expect(soleReference('{space.16} {space.8}')).toBeNull();
    expect(soleReference('48px')).toBeNull();
  });
});
