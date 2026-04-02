import {
  createCssBlock,
  flattenDesignTokens,
  validateTierReferences,
  type DtcgTokenTree,
  type FlattenedDesignToken,
} from '@oaknational/design-tokens-core';
import componentTokens from './tokens/component.json';
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
  const rootTokenTree = mergeTokenTrees(paletteTokens, semanticLightTokens, componentTokens);
  const darkTokenTree = mergeTokenTrees(semanticDarkTokens);

  validateTierReferences(rootTokenTree);
  validateTierReferences(darkTokenTree);

  const darkThemeTokens = inlinePaletteReferences(
    flattenDesignTokens(darkTokenTree),
    paletteTokens,
  );

  return [
    '/* Generated file: do not edit directly. */',
    createCssBlock(':root', flattenDesignTokens(rootTokenTree)),
    createCssBlock("[data-theme='dark']", darkThemeTokens),
    '',
  ].join('\n');
}
