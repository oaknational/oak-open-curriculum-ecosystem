import { describe, expect, it } from 'vitest';

import { findLiteralDesignValues } from '../../tools/css-literal-values';

import { buildCatalogue, type DtcgTree } from './token-catalogue';
import { loadCatalogue } from './token-source';
import { tokenVarsStylesheet } from './token-vars';

/**
 * The generated sheet is CSS that no `.css` file holds, so the walk in
 * `validate-authored-css` cannot see it. Rather than let the instrument have
 * a blind spot the page's own stylesheet sits behind, the same classifier
 * that gates every authored sheet is run over the generated text here — on
 * the real kit catalogue, not a fixture, so a token whose value could smuggle
 * a literal through would fail this test rather than ship.
 */

function tree(file: string, tier: 1 | 2 | 3, data: unknown): DtcgTree {
  return { file, tier, theme: null, data };
}

const FIXTURE = buildCatalogue([
  tree('palette.json', 1, { oak: { color: { white: { $value: '#ffffff', $type: 'color' } } } }),
  tree('primitives.json', 1, {
    space: { 16: { $value: '16px', $type: 'dimension' } },
    motion: { base: { $value: '200ms', $type: 'duration' } },
  }),
]);

describe('tokenVarsStylesheet', () => {
  it('binds each specimen-bearing token to itself through the row attribute', () => {
    const css = tokenVarsStylesheet(FIXTURE.tokens);
    expect(css).toContain("[data-token='--oak-white']{--tok:var(--oak-white)}");
    expect(css).toContain("[data-token='--space-16']{--tok:var(--space-16)}");
  });

  it('emits no rule for a token with no specimen — an unused binding is weight for nothing', () => {
    // --motion-base is a duration: shown as a value, never painted.
    expect(tokenVarsStylesheet(FIXTURE.tokens)).not.toContain('--motion-base');
  });

  it('carries no literal design value, by the classifier that gates authored CSS', () => {
    const findings = findLiteralDesignValues(tokenVarsStylesheet(FIXTURE.tokens));
    expect(findings).toEqual([]);
  });

  it('carries no literal design value across the whole published catalogue', () => {
    // The real trees, not a fixture: their values are the ones that would
    // have to leak, and this is the only test that can prove they do not.
    const findings = findLiteralDesignValues(tokenVarsStylesheet(loadCatalogue().tokens));
    expect(findings).toEqual([]);
  });
});
