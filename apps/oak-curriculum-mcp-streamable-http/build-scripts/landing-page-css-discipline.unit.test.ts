/**
 * Holds the page's composition layer to the claim it opens with.
 *
 * @remarks
 * `public/landing-page.css` begins "Everything here resolves through
 * design-system tokens — no raw colours, fonts, or spacing values." That was an
 * assertion in a comment, and a design-system review found it already untrue:
 * the file reached past the semantic tier to two `--oak-*` primitives, which
 * silently discarded the high-contrast theme's own shadow choice for that
 * subtree.
 *
 * A comment cannot check the file it sits in. This does.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';

import { readAppText } from './test-helpers/oak-ds-fixtures.js';

const CSS_PATH = 'public/landing-page.css';

/** Strips comments so prose about hex values is not read as a hex value. */
function withoutComments(css: string): string {
  return css.replaceAll(/\/\*[\s\S]*?\*\//g, '');
}

describe('landing-page.css token discipline', () => {
  it('names no raw colour', async () => {
    const css = withoutComments(await readAppText(CSS_PATH));

    expect(css.match(/#[0-9a-f]{3,8}\b/gi) ?? []).toStrictEqual([]);
    expect(css.match(/\b(?:rgba?|hsla?)\(/gi) ?? []).toStrictEqual([]);
  });

  it('reaches no further down than the semantic tier', async () => {
    // Tier 1 is the palette. Composition consumes roles, so that a theme which
    // re-points a role — as high-contrast does for --shadow-ground — is obeyed
    // rather than overridden by a page that named the primitive underneath it.
    const css = withoutComments(await readAppText(CSS_PATH));

    expect(css.match(/var\(\s*--oak-[\w-]+/g) ?? []).toStrictEqual([]);
  });

  it('sizes nothing with a bare length', async () => {
    // Spacing, radii and borders all have tokens. The exceptions are the
    // viewport units inside clamp() and the media-query breakpoints, neither of
    // which a token can express.
    const withoutQueries = withoutComments(await readAppText(CSS_PATH)).replaceAll(
      /@media[^{]+\{/g,
      '{',
    );
    const declarations = withoutQueries.replaceAll(/clamp\([^)]*\)/g, 'clamp()');

    expect(declarations.match(/:\s*[^;{}]*?\b\d+(?:\.\d+)?(?:px|rem|em)\b/g) ?? []).toStrictEqual(
      [],
    );
  });
});
