/**
 * Terminal-friendly Oak design token projection.
 *
 * @remarks
 * Ink and other terminal renderers cannot consume CSS custom properties. This
 * module resolves the existing DTCG token source into a small semantic colour
 * contract for terminal UIs while keeping the token JSON as the source of
 * truth.
 *
 * @packageDocumentation
 */
import { resolveTokenTreeToHex, type DtcgTokenTree } from '@oaknational/design-tokens-core';
import componentTokens from './tokens/component.json';
import paletteTokens from './tokens/palette.json';
import semanticDarkTokens from './tokens/semantic.dark.json';
import semanticLightTokens from './tokens/semantic.light.json';

/** Theme modes supported by the terminal projection. */
export type OakTerminalThemeMode = 'light' | 'dark';

/** Semantic colours used by terminal design primitives. */
export interface OakTerminalColourTheme {
  readonly page: string;
  readonly panel: string;
  readonly border: string;
  readonly text: string;
  readonly muted: string;
  readonly inverse: string;
  readonly accent: string;
  readonly active: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
}

/** Resolved terminal theme derived from Oak design tokens. */
export interface OakTerminalTheme {
  readonly mode: OakTerminalThemeMode;
  readonly colours: OakTerminalColourTheme;
}

const lightTokenTree = mergeTokenTrees(paletteTokens, semanticLightTokens, componentTokens);
const darkTokenTree = mergeTokenTrees(paletteTokens, semanticDarkTokens, componentTokens);

/** Light and dark Oak terminal themes. */
export const oakTerminalThemes = {
  light: createTerminalTheme('light', resolveTokenTreeToHex(lightTokenTree)),
  dark: createTerminalTheme('dark', resolveTokenTreeToHex(darkTokenTree)),
} as const satisfies Record<OakTerminalThemeMode, OakTerminalTheme>;

function createTerminalTheme(
  mode: OakTerminalThemeMode,
  resolved: ReadonlyMap<string, string>,
): OakTerminalTheme {
  return {
    mode,
    colours: {
      page: requiredColour(resolved, 'component.page-background'),
      panel: requiredColour(resolved, 'component.shell-surface'),
      border: requiredColour(resolved, 'component.shell-border-color'),
      text: requiredColour(resolved, 'component.page-text-color'),
      muted: requiredColour(resolved, 'component.status-text-color'),
      inverse: requiredColour(resolved, 'semantic.text-inverse'),
      accent: requiredColour(resolved, 'semantic.accent'),
      active: requiredColour(resolved, 'semantic.accent-strong'),
      success: requiredColour(resolved, 'component.status-connected-text-color'),
      warning: requiredColour(resolved, 'semantic.focus-ring'),
      danger: requiredColour(resolved, 'component.status-error-text-color'),
    },
  };
}

function requiredColour(resolved: ReadonlyMap<string, string>, tokenPath: string): string {
  const colour = resolved.get(tokenPath);
  if (colour === undefined) {
    throw new Error(`Missing terminal colour token: ${tokenPath}`);
  }

  return colour;
}

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
