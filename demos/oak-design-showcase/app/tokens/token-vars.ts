/**
 * The one binding the page cannot author by hand: for each catalogued
 * token, a rule pointing that row's `--tok` at the token itself.
 *
 * WHY THIS EXISTS AT ALL. The page's claim is that a token's value is
 * whatever the cascade says it is, so every specimen has to be a real
 * element painted through `var(--the-token)` — 414 different property
 * names, one per row. CSS cannot build a `var()` name from an attribute, so
 * the binding is per token and therefore generated.
 *
 * WHY IT IS SERVED, NOT INLINED. The workspace bans both inline-style
 * shapes for the same reason (eslint `no-restricted-syntax` here): a `style`
 * attribute caps what an identity's expression layer can transform, and a
 * `<style>` element would put CSS somewhere neither half of the
 * no-hardcoded-values instrument looks. This sheet is served from a route
 * instead, and the instrument is applied to it directly: this module's unit
 * test runs the very classifier `validate-authored-css` runs, over the
 * generated text. The rule's purpose is honoured rather than routed around —
 * a literal design value cannot reach this sheet, because every rule it can
 * emit is a `var()` reference to a name that came out of the kit's own
 * export.
 *
 * Sheet ORDER does not matter. These rules declare `--tok` and nothing
 * else, and `var()` in a custom property is substituted at computed-value
 * time from whatever the element inherits — so an identity sheet loading
 * later re-points the token and every bound specimen follows, with no
 * JavaScript and no re-render.
 *
 * Tokens with no specimen (`plain`) get no rule: their value is read from
 * the custom property directly, and an unused binding is weight for nothing.
 */
import type { CatalogueToken } from './token-catalogue';

/** The route this sheet is served from, named once for the page's link. */
export const TOKEN_VARS_HREF = '/tokens/token-vars';

/**
 * The generated stylesheet. One rule per specimen-bearing token, keyed by
 * the `data-token` attribute its row carries.
 */
export function tokenVarsStylesheet(tokens: readonly CatalogueToken[]): string {
  const rules = tokens
    .filter((token) => token.kind !== 'plain')
    .map((token) => `[data-token='${token.name}']{--tok:var(${token.name})}`);
  return [
    '/* Generated from the kit DTCG export by app/tokens/token-vars.ts.',
    '   One binding per token: the row sets --tok, the page stylesheet paints it. */',
    ...rules,
    '',
  ].join('\n');
}
