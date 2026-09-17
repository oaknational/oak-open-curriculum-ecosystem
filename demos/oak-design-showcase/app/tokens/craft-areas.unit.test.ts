import { describe, expect, it } from 'vitest';

import { CRAFT_AREAS, craftAreaOf, sectionId } from './craft-areas';
import { loadCatalogue } from './token-source';

/**
 * The craft map is a hand-written table over names the design system owns,
 * so the failure it can have is falling behind: a family arrives upstream,
 * no row names it, and it files itself under "Not yet placed" where a
 * reader looking for a colour will never think to look.
 *
 * The first test is therefore the one that matters — it runs the map over
 * the REAL published catalogue, so drift lands as a red test rather than as
 * a quietly mis-filed section on a page nobody re-reads.
 */

describe('the craft map against the published catalogue', () => {
  const families = [...new Set(loadCatalogue().tokens.map((token) => token.family))];

  it('places every family the design system actually publishes', () => {
    const unplaced = families.filter((family) => craftAreaOf(family) === 'other');
    expect(unplaced).toEqual([]);
  });

  it('covers a real spread of families, so the test above cannot pass vacuously', () => {
    expect(families.length).toBeGreaterThan(40);
  });
});

describe('craftAreaOf', () => {
  it('places the families whose names would mislead a rule', () => {
    // None of these three could be placed by any pattern over the name:
    // label is case grammar, key is alignment, control is padding.
    expect(craftAreaOf('label')).toBe('typography');
    expect(craftAreaOf('key')).toBe('layout');
    expect(craftAreaOf('control')).toBe('sizing');
  });

  it('keeps the palette with the roles it feeds', () => {
    expect(craftAreaOf('oak')).toBe('colour');
    expect(craftAreaOf('surface')).toBe('colour');
    expect(craftAreaOf('filter')).toBe('colour');
  });

  it('reports an unknown family as unplaced rather than guessing at it', () => {
    expect(craftAreaOf('nothing-upstream-calls-this')).toBe('other');
  });
});

describe('CRAFT_AREAS', () => {
  it('describes every area craftAreaOf can return, so no group renders unlabelled', () => {
    const described = new Set(CRAFT_AREAS.map((area) => area.id));
    for (const family of ['oak', 'font', 'space', 'border', 'motion', 'layer', 'btn', 'unknown']) {
      expect(described.has(craftAreaOf(family))).toBe(true);
    }
  });

  it('names each area once', () => {
    expect(new Set(CRAFT_AREAS.map((area) => area.id)).size).toBe(CRAFT_AREAS.length);
  });
});

describe('sectionId', () => {
  it('keys a section by area AND family, so a family in two areas cannot collide', () => {
    expect(sectionId('colour', 'border')).toBe('tokens-colour-border');
    expect(sectionId('elevation', 'border')).toBe('tokens-elevation-border');
  });
});
