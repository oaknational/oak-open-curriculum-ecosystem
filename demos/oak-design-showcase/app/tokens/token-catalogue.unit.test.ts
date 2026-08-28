import { describe, expect, it } from 'vitest';

import { buildCatalogue, type DtcgTree } from './token-catalogue';

/**
 * What the catalogue decides is how many rows the page has and what each one
 * claims. The de-duplication is the load-bearing part: the theme trees
 * declare the same roles over again, and a page that listed each face
 * separately would show four contradictory values for one token instead of
 * the one value the browser is actually using.
 */

function tree(file: string, tier: 1 | 2 | 3, theme: string | null, data: unknown): DtcgTree {
  return { file, tier, theme, data };
}

describe('buildCatalogue', () => {
  it('flattens leaves and rewrites references as the var() calls the CSS holds', () => {
    const catalogue = buildCatalogue([
      tree('semantic.light.json', 2, 'light', {
        text: { primary: { $value: '{oak.color.black}', $type: 'color' } },
      }),
    ]);
    expect(catalogue.tokens).toHaveLength(1);
    expect(catalogue.tokens[0]).toMatchObject({
      name: '--text-primary',
      path: 'text.primary',
      tier: 2,
      family: 'text',
      kind: 'colour',
      declared: 'var(--oak-black)',
    });
  });

  it('takes a numeric $value, which is how the fluid heading parts are written', () => {
    // The nine type.heading-N-min/max/leading leaves are unitless JSON
    // numbers. A string-only reader drops exactly the tokens an identity
    // tunes its heading curve with — which is what the first render of
    // this page did.
    const catalogue = buildCatalogue([
      tree('semantic.light.json', 2, 'light', {
        type: { 'heading-1-min': { $value: 2.5, $type: 'number' } },
      }),
    ]);
    expect(catalogue.tokens[0]).toMatchObject({ name: '--type-heading-1-min', declared: '2.5' });
  });

  it('ignores a node whose $value is neither string nor number rather than minting a broken token', () => {
    const catalogue = buildCatalogue([
      tree('broken.json', 1, null, { space: { 4: { $value: { nested: true } } } }),
    ]);
    expect(catalogue.tokens).toHaveLength(0);
  });

  it('walks nested groups to whatever depth the tree has', () => {
    const catalogue = buildCatalogue([
      tree('palette.json', 1, null, {
        oak: { color: { white: { $value: '#ffffff', $type: 'color' } } },
      }),
    ]);
    expect(catalogue.tokens.map((token) => token.name)).toEqual(['--oak-white']);
  });
});

describe('buildCatalogue across theme faces', () => {
  const trees = [
    tree('semantic.light.json', 2, 'light', {
      bg: { primary: { $value: '{oak.color.white}', $type: 'color' } },
    }),
    tree('semantic.dark.json', 2, 'dark', {
      bg: { primary: { $value: '{oak.color.black}', $type: 'color' } },
    }),
  ];

  it('lists a token once and records every face that declares it', () => {
    const catalogue = buildCatalogue(trees);
    expect(catalogue.tokens).toHaveLength(1);
    expect(catalogue.tokens[0]?.themes).toEqual(['light', 'dark']);
  });

  it('counts both leaves, so the page can explain the gap rather than hide it', () => {
    expect(buildCatalogue(trees).leafCount).toBe(2);
  });

  it('keeps the first tree as the row owner, so the light face leads', () => {
    expect(buildCatalogue(trees).tokens[0]?.declared).toBe('var(--oak-white)');
  });
});

describe('buildCatalogue theme dependence (transitive)', () => {
  const trees = [
    tree('primitives.json', 1, null, {
      oak: { white: { $value: '#ffffff', $type: 'color' } },
    }),
    tree('semantic.light.json', 2, 'light', {
      bg: { primary: { $value: '{oak.white}', $type: 'color' } },
    }),
    tree('semantic.dark.json', 2, 'dark', {
      bg: { primary: { $value: '#222222', $type: 'color' } },
    }),
    tree('semantic.high-contrast.json', 2, 'high-contrast', {
      state: { focus: { $value: '#ffe555', $type: 'color' } },
    }),
    tree('component.json', 3, null, {
      card: { bg: { $value: '{bg.primary}', $type: 'color' } },
      chip: { bg: { $value: '{card.bg}', $type: 'color' } },
      input: { 'min-h': { $value: '48px', $type: 'dimension' } },
    }),
  ];
  const themedByName = new Map(
    buildCatalogue(trees).tokens.map((token) => [token.name, token.themed]),
  );

  it('marks a token declared by theme faces', () => {
    expect(themedByName.get('--bg-primary')).toBe(true);
  });

  it('marks a token a SINGLE theme face declares — one override already moves the value', () => {
    expect(themedByName.get('--state-focus')).toBe(true);
  });

  it('marks an alias of a themed token, though it declares one face itself', () => {
    expect(themedByName.get('--card-bg')).toBe(true);
  });

  it('follows references to any depth — the alias of the alias is themed too', () => {
    expect(themedByName.get('--chip-bg')).toBe(true);
  });

  it('leaves an untouched literal unmarked, so the marker keeps its meaning', () => {
    expect(themedByName.get('--input-min-h')).toBe(false);
    expect(themedByName.get('--oak-white')).toBe(false);
  });
});

describe('buildCatalogue exclusions', () => {
  it('excludes icon URL properties and counts what it excluded', () => {
    const catalogue = buildCatalogue([
      tree('icons.json', 3, null, {
        i: { search: { $value: "url('assets/icons/search.svg')" } },
        ic: { search: { $value: '{i.search}' } },
        input: { 'min-h': { $value: '48px', $type: 'dimension' } },
      }),
    ]);
    expect(catalogue.tokens.map((token) => token.name)).toEqual(['--input-min-h']);
    expect(catalogue.excludedIconCount).toBe(2);
  });
});

describe('buildCatalogue type inheritance', () => {
  it('inherits the type of a sole reference, which is what earns component tokens a specimen', () => {
    const catalogue = buildCatalogue([
      tree('primitives.json', 1, null, {
        size: { target: { $value: '48px', $type: 'dimension' } },
      }),
      // The export types literals only, so this arrives untyped.
      tree('component.json', 3, null, { btn: { 'min-h': { $value: '{size.target}' } } }),
    ]);
    const button = catalogue.tokens.find((token) => token.name === '--btn-min-h');
    expect(button?.type).toBe('dimension');
    expect(button?.kind).toBe('length');
  });

  it('follows a chain of single references to the literal at the end of it', () => {
    const catalogue = buildCatalogue([
      tree('primitives.json', 1, null, {
        space: { 4: { $value: '4px', $type: 'dimension' } },
        radius: { s: { $value: '{space.4}' } },
      }),
      tree('component.json', 3, null, { card: { gap: { $value: '{radius.s}' } } }),
    ]);
    expect(catalogue.tokens.find((token) => token.name === '--card-gap')?.type).toBe('dimension');
  });
});

describe('buildCatalogue type-inheritance refusals', () => {
  it('leaves a multi-reference value untyped, so no specimen binds to a value it may break on', () => {
    const catalogue = buildCatalogue([
      tree('primitives.json', 1, null, {
        space: {
          16: { $value: '16px', $type: 'dimension' },
          2: { $value: '2px', $type: 'dimension' },
        },
      }),
      // A two-value padding: bound to inline-size it would render a bar of
      // the wrong length, silently. It is shown as a value only.
      tree('component.json', 3, null, {
        quiz: { pad: { $value: 'calc({space.16} - {space.2}) {space.16}' } },
      }),
    ]);
    const quiz = catalogue.tokens.find((token) => token.name === '--quiz-pad');
    expect(quiz?.type).toBeNull();
    expect(quiz?.kind).toBe('plain');
    expect(quiz?.functional).toBe(true);
  });

  it('terminates on a reference cycle instead of chasing it', () => {
    const catalogue = buildCatalogue([
      tree('cycle.json', 2, null, { a: { $value: '{b}' }, b: { $value: '{a}' } }),
    ]);
    expect(catalogue.tokens.map((token) => token.type)).toEqual([null, null]);
  });
});
