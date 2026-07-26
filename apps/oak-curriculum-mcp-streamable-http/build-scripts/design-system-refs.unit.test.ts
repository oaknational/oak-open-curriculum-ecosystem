/**
 * Holds the page's design-system references to the design system itself.
 *
 * @remarks
 * These are the two values the page cannot express as a token at its point of
 * use, so they are the two places it can drift away from the system without
 * anything going red. Each is pinned against the real package here, rather
 * than trusted to a comment.
 *
 * Lives beside the copy-manifest tests because it needs the same real IO for
 * the same reason (ADR-078's structural allowlist): the subject is a value
 * copied OUT of the package, and a fixture would assert the copy against
 * itself.
 *
 * @packageDocumentation
 */

import { describe, expect, it } from 'vitest';

import { OAK_DS_BASE, OAK_MINT } from '../src/landing-page/components/design-system-refs.js';
import { THEME_OPTIONS } from '../src/landing-page/components/site-chrome.js';
import { OAK_DS_PUBLIC_DIRNAME, resolveOakDsPackageRoot } from './copy-oak-ds.js';
import { readPackageText } from './test-helpers/oak-ds-fixtures.js';

describe('design-system references', () => {
  it('serves the design system from the directory the copy step publishes', () => {
    // The URL prefix in the markup and the directory the build writes are one
    // decision. Split them and the page 404s every asset with a green suite.
    expect(OAK_DS_BASE).toBe(`/${OAK_DS_PUBLIC_DIRNAME}`);
  });

  it('pins the theme-colour literal to the design system’s mint token', async () => {
    // <meta> resolves no var(), so this colour has to be literal in the markup.
    // That makes it the page's only un-tokenised colour, and the one value a
    // palette change would leave stale with nothing to catch it.
    const palette = await readPackageText(resolveOakDsPackageRoot(), 'dtcg/palette.json');
    const mint: unknown = JSON.parse(palette);

    expect(findTokenValue(mint, 'mint')).toBe(OAK_MINT);
  });

  it('offers exactly the themes oak-theme.js will accept', async () => {
    // The control's list was hand-copied, and the only guard over it iterated
    // that same copy — so it proved the page renders its own array and nothing
    // about the design system. `oak-theme.js` owns the list: it rejects any
    // value outside THEMES, so a theme the script gained but the control never
    // offered is unreachable, and one the control offers but the script
    // rejects is a dead option. Set equality is the invariant, both ways.
    const script = await readPackageText(resolveOakDsPackageRoot(), 'oak-theme.js');
    const declared = /var THEMES\s*=\s*\[([^\]]+)\]/.exec(script)?.[1];

    expect(declared, 'THEMES not found in oak-theme.js').toBeDefined();

    const scriptThemes = [...(declared ?? '').matchAll(/'([^']+)'/g)]
      .map((match) => match[1])
      .filter((theme): theme is string => theme !== undefined);
    const offered = THEME_OPTIONS.map((option) => option.value);

    expect(sortedByName(scriptThemes)).toStrictEqual(sortedByName(offered));
  });
});

/** Sort with an explicit collation, so the order is a decision not a default. */
function sortedByName(values: readonly string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Depth-first search for a DTCG token's `$value` by token name. */
function findTokenValue(node: unknown, tokenName: string): string | undefined {
  if (!isRecord(node)) {
    return undefined;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key === tokenName && isRecord(value) && typeof value.$value === 'string') {
      return value.$value;
    }

    const nested = findTokenValue(value, tokenName);
    if (nested !== undefined) {
      return nested;
    }
  }

  return undefined;
}
