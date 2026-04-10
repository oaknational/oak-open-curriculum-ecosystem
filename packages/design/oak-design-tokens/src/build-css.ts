import {
  createCssBlock,
  emitCssVariables,
  flattenDesignTokens,
  resolveTokenTreeToHex,
  validateContrastPairings,
  validateTierReferences,
  type ContrastReport,
  type ContrastValidationError,
  type DtcgTokenTree,
  type FlattenedDesignToken,
} from '@oaknational/design-tokens-core';
import { type Result, err, ok } from '@oaknational/result';
import componentTokens from './tokens/component.json';
import contrastPairingsManifest from './tokens/contrast-pairings.js';
import paletteTokens from './tokens/palette.json';
import semanticDarkTokens from './tokens/semantic.dark.json';
import semanticLightTokens from './tokens/semantic.light.json';

const PALETTE_VARIABLE_PATTERN = /var\((--oak-color-[^)]+)\)/gu;

function mergeTokenTrees(...tokenTrees: readonly DtcgTokenTree[]): DtcgTokenTree {
  let mergedTree: DtcgTokenTree = {};

  for (const tokenTree of tokenTrees) {
    mergedTree = {
      ...mergedTree,
      ...tokenTree,
    };
  }

  return mergedTree;
}

const lightTokenTree = mergeTokenTrees(paletteTokens, semanticLightTokens, componentTokens);

function inlinePaletteReferences(
  tokens: readonly FlattenedDesignToken[],
  paletteTokenTree: DtcgTokenTree,
): readonly FlattenedDesignToken[] {
  const paletteValues = new Map(
    flattenDesignTokens(paletteTokenTree).map((token) => [token.cssVariable, token.cssValue]),
  );

  return tokens.map((token) => ({
    ...token,
    cssValue: token.cssValue.replace(PALETTE_VARIABLE_PATTERN, (_match, cssVariable: string) => {
      return paletteValues.get(cssVariable) ?? `var(${cssVariable})`;
    }),
  }));
}

export function buildOakDesignTokensCss(): string {
  const darkTokenTree = mergeTokenTrees(semanticDarkTokens);

  validateTierReferences(lightTokenTree);
  validateTierReferences(darkTokenTree);

  const darkThemeTokens = inlinePaletteReferences(
    flattenDesignTokens(darkTokenTree),
    paletteTokens,
  );

  const darkCssBlock = emitCssVariables(darkThemeTokens).join('\n');

  return [
    '/* Generated file: do not edit directly. */',
    createCssBlock(':root', flattenDesignTokens(lightTokenTree)),
    // Pure CSS dark mode: responds to OS preference without JavaScript.
    // :not([data-theme='light']) allows an explicit light override from the
    // MCP Apps SDK host to win via specificity.
    `@media (prefers-color-scheme: dark) {\n  :root:not([data-theme='light']) {\n${darkCssBlock}\n  }\n}`,
    // Attribute selector: used by the MCP Apps SDK applyDocumentTheme() and
    // the inline <script> fallback to force a specific theme.
    createCssBlock("[data-theme='dark']", darkThemeTokens),
    '',
  ].join('\n');
}

/**
 * Build contrast validation reports for both light and dark themes.
 *
 * @remarks
 * Resolves all colour tokens to hex for each theme, then validates every
 * pairing declared in the contrast manifest against WCAG 2.2 AA thresholds.
 * Returns Ok with one report per theme, or Err if any manifest token path
 * cannot be resolved.
 *
 * @returns Ok with contrast reports, or Err with the first unresolved token
 */
export function buildContrastReports(): Result<readonly ContrastReport[], ContrastValidationError> {
  const darkTokenTree = mergeTokenTrees(paletteTokens, semanticDarkTokens, componentTokens);

  const lightResolved = resolveTokenTreeToHex(lightTokenTree);
  const darkResolved = resolveTokenTreeToHex(darkTokenTree);

  const lightResult = validateContrastPairings(lightResolved, contrastPairingsManifest, 'light');

  if (!lightResult.ok) {
    return err(lightResult.error);
  }

  const darkResult = validateContrastPairings(darkResolved, contrastPairingsManifest, 'dark');

  if (!darkResult.ok) {
    return err(darkResult.error);
  }

  return ok([lightResult.value, darkResult.value]);
}
