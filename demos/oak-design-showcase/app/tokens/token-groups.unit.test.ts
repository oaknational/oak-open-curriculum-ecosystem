import { describe, expect, it } from 'vitest';

import { buildCatalogue, type DtcgTree } from './token-catalogue';
import { groupByCraftArea } from './token-groups';

/**
 * The grouping is the page's outline, and it is derived rather than
 * curated — so what matters is that it follows the kit's own order and the
 * craft map's taxonomy instead of imposing a third thing. A curated list
 * would be one more place to keep in step with upstream, which is the
 * failure this shape exists to avoid.
 */

function tree(file: string, tier: 1 | 2 | 3, theme: string | null, data: unknown): DtcgTree {
  return { file, tier, theme, data };
}

const COLOUR_AND_SPACE = [
  tree('primitives.json', 1, null, { space: { 16: { $value: '16px', $type: 'dimension' } } }),
  tree('semantic.light.json', 2, 'light', {
    text: { primary: { $value: '#000', $type: 'color' } },
    bg: { primary: { $value: '#fff', $type: 'color' } },
  }),
];

describe('groupByCraftArea', () => {
  it('leads with craft, not with how the system is layered', () => {
    const groups = groupByCraftArea(buildCatalogue(COLOUR_AND_SPACE).tokens);
    expect(groups.map((group) => group.area)).toEqual(['colour', 'sizing']);
  });

  it('keeps families in the kit’s own declaration order within an area', () => {
    const [colour] = groupByCraftArea(buildCatalogue(COLOUR_AND_SPACE).tokens);
    expect(colour?.families.map((family) => family.family)).toEqual(['text', 'bg']);
  });

  it('drops an area with nothing in it rather than rendering an empty heading', () => {
    const groups = groupByCraftArea(buildCatalogue(COLOUR_AND_SPACE).tokens);
    expect(groups.map((group) => group.area)).not.toContain('motion');
  });

  it('carries the area’s title and note, so the section can name itself', () => {
    const [colour] = groupByCraftArea(buildCatalogue(COLOUR_AND_SPACE).tokens);
    expect(colour?.title).toBe('Colour');
    expect(colour?.note).not.toBe('');
  });
});

describe('groupByCraftArea across tiers', () => {
  it('gathers a family that spans tiers into ONE section', () => {
    // --border-solid-m is a tier-1 scale and --border-primary a tier-2
    // role. A designer reaching for a border wants both in front of them;
    // splitting them by tier served the system, not the reader.
    const catalogue = buildCatalogue([
      tree('primitives.json', 1, null, {
        border: { 'solid-m': { $value: '2px', $type: 'dimension' } },
      }),
      tree('semantic.light.json', 2, 'light', {
        border: { primary: { $value: '#000', $type: 'color' } },
      }),
    ]);
    const groups = groupByCraftArea(catalogue.tokens);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.families).toHaveLength(1);
    expect(groups[0]?.families[0]?.tokens.map((token) => token.name)).toEqual([
      '--border-solid-m',
      '--border-primary',
    ]);
  });

  it('keeps each token’s tier, which the row still annotates', () => {
    const catalogue = buildCatalogue([
      tree('primitives.json', 1, null, {
        border: { 'solid-m': { $value: '2px', $type: 'dimension' } },
      }),
      tree('semantic.light.json', 2, 'light', {
        border: { primary: { $value: '#000', $type: 'color' } },
      }),
    ]);
    const tokens = groupByCraftArea(catalogue.tokens)[0]?.families[0]?.tokens ?? [];
    expect(tokens.map((token) => token.tier)).toEqual([1, 2]);
  });
});
