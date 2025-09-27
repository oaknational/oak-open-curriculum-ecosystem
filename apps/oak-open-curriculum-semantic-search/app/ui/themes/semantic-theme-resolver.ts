import {
  oakAllSpacingTokens,
  oakBorderRadiusTokens,
  oakFontTokens,
  oakInnerPaddingTokens,
  oakSpaceBetweenTokens,
} from '@oaknational/oak-components';
import type {
  OakInnerPaddingToken,
  OakSpaceBetweenToken,
  OakBorderRadiusToken,
  OakAllSpacingToken,
} from '@oaknational/oak-components';
import { semanticThemeSpec } from './semantic-theme-spec';
import type {
  SemanticAppSpec,
  SemanticMode,
  SemanticTypographySpecEntry,
} from './semantic-theme-types';
import { resolveSemanticColor, type SemanticColorToken } from './semantic-color-registry';

function pxToRem(px: number): string {
  return `${parseFloat((px / 16).toFixed(3))}rem`;
}

function pxToPx(px: number): string {
  return `${px}px`;
}

function isOakAllSpacingToken(value: string): value is OakAllSpacingToken {
  return value in oakAllSpacingTokens;
}

function resolveSpaceBetween(token: OakSpaceBetweenToken): number {
  const candidate = oakSpaceBetweenTokens[token];
  if (!isOakAllSpacingToken(candidate)) {
    throw new Error(`Unexpected space-between token mapping for "${token}"`);
  }
  const px = oakAllSpacingTokens[candidate];
  if (typeof px !== 'number') {
    throw new Error(`Unable to resolve spacing token "${token}"`);
  }
  return px;
}

function resolveInnerPadding(token: OakInnerPaddingToken): number {
  const candidate = oakInnerPaddingTokens[token];
  if (!isOakAllSpacingToken(candidate)) {
    throw new Error(`Unexpected inner padding token mapping for "${token}"`);
  }
  const px = oakAllSpacingTokens[candidate];
  if (typeof px !== 'number') {
    throw new Error(`Unable to resolve spacing token "${token}"`);
  }
  return px;
}

function resolveColorToken(token: SemanticColorToken): string {
  return resolveSemanticColor(token);
}

export interface ResolvedTypographyEntry {
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly fontStyle: 'normal' | 'italic';
  readonly fontSizeRem: string;
  readonly lineHeight: number;
  readonly letterSpacing: string;
}

// This list is defined in two places, fix.
export interface ResolvedAppTokens {
  readonly colors: Record<
    | 'textPrimary'
    | 'textSubdued'
    | 'headerBorder'
    | 'borderAccent'
    | 'borderSubtle'
    | 'borderStrong'
    | 'textMuted'
    | 'errorText'
    | 'pageNote'
    | 'docsNote'
    | 'surfaceCard'
    | 'surfaceRaised',
    string
  > & {
    readonly surfaceEmphasisBg: string;
  };
  readonly space: {
    readonly gap: Record<'grid' | 'section' | 'cluster', string>;
    readonly padding: Record<'card' | 'pill', string>;
  };
  readonly radii: Record<'card' | 'pill', string>;
  readonly typography: {
    readonly hero: ResolvedTypographyEntry;
    readonly heading: ResolvedTypographyEntry;
    readonly subheading: ResolvedTypographyEntry;
    readonly body: ResolvedTypographyEntry;
    readonly bodyStrong: ResolvedTypographyEntry;
    readonly caption: ResolvedTypographyEntry;
    readonly quote: ResolvedTypographyEntry;
  };
  readonly fonts: {
    readonly primary: string;
    readonly secondary: string;
  };
  readonly layout: {
    readonly containerMaxWidth: string;
    readonly controlColumnMinWidth: string;
    readonly secondaryColumnMinWidth: string;
    readonly inlinePadding: Record<'base' | 'wide', string>;
    readonly breakpoints: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', string>;
  };
  readonly palette: {
    readonly brandPrimary: string;
    readonly brandPrimaryDark: string;
    readonly brandPrimaryDeep: string;
    readonly brandPrimaryBright: string;
  };
}

function resolveTypographyEntry(
  entry: SemanticTypographySpecEntry,
  spec: SemanticAppSpec,
): ResolvedTypographyEntry {
  const [, fontSizePx, fontWeight, letterSpacing] = oakFontTokens[entry.token];
  const fontFamily = entry.fontFamilyOverride ?? spec.fonts.primaryFamily;
  const lineHeight = Number(entry.lineHeight.toFixed(3));
  return {
    fontFamily,
    fontWeight,
    fontStyle: entry.fontStyle ?? 'normal',
    fontSizeRem: pxToRem(fontSizePx),
    lineHeight,
    letterSpacing,
  };
}

function resolveRadii(token: OakBorderRadiusToken): string {
  const px = oakBorderRadiusTokens[token];
  if (typeof px !== 'number') {
    throw new TypeError(`Unknown border radius token "${token}"`);
  }
  return pxToPx(px);
}

function resolveSpace(spec: SemanticAppSpec['space']): ResolvedAppTokens['space'] {
  return {
    gap: {
      grid: pxToRem(resolveSpaceBetween(spec.gap.grid)),
      section: pxToRem(resolveSpaceBetween(spec.gap.section)),
      cluster: pxToRem(resolveSpaceBetween(spec.gap.cluster)),
    },
    padding: {
      card: pxToRem(resolveInnerPadding(spec.padding.card)),
      pill: pxToRem(resolveInnerPadding(spec.padding.pill)),
    },
  };
}

function resolveInlinePadding(
  tokens: SemanticAppSpec['layout']['inlinePadding'],
): ResolvedAppTokens['layout']['inlinePadding'] {
  return {
    base: pxToRem(resolveSpaceBetween(tokens.base)),
    wide: pxToRem(resolveSpaceBetween(tokens.wide)),
  };
}

// Turn this into a type-safe map
function resolveColors(spec: SemanticAppSpec['colors']): ResolvedAppTokens['colors'] {
  return {
    textPrimary: resolveColorToken(spec.textPrimary),
    textSubdued: resolveColorToken(spec.textSubdued),
    headerBorder: resolveColorToken(spec.headerBorder),
    borderAccent: resolveColorToken(spec.borderAccent),
    borderSubtle: resolveColorToken(spec.borderSubtle),
    borderStrong: resolveColorToken(spec.borderStrong),
    textMuted: resolveColorToken(spec.textMuted),
    errorText: resolveColorToken(spec.errorText),
    pageNote: resolveColorToken(spec.pageNote),
    docsNote: resolveColorToken(spec.docsNote),
    surfaceCard: resolveColorToken(spec.surfaceCard),
    surfaceRaised: resolveColorToken(spec.surfaceRaised),
    surfaceEmphasisBg: spec.surfaceEmphasisBg,
  };
}

function resolvePalette(spec: SemanticAppSpec['palette']): ResolvedAppTokens['palette'] {
  return {
    brandPrimary: resolveColorToken(spec.brandPrimary),
    brandPrimaryDark: resolveColorToken(spec.brandPrimaryDark),
    brandPrimaryDeep: resolveColorToken(spec.brandPrimaryDeep),
    brandPrimaryBright: resolveColorToken(spec.brandPrimaryBright),
  };
}

export function resolveAppTokens(mode: SemanticMode): ResolvedAppTokens {
  const spec = semanticThemeSpec[mode].app;
  const typography = {
    hero: resolveTypographyEntry(spec.typography.hero, spec),
    heading: resolveTypographyEntry(spec.typography.heading, spec),
    subheading: resolveTypographyEntry(spec.typography.subheading, spec),
    body: resolveTypographyEntry(spec.typography.body, spec),
    bodyStrong: resolveTypographyEntry(spec.typography.bodyStrong, spec),
    caption: resolveTypographyEntry(spec.typography.caption, spec),
    quote: resolveTypographyEntry(spec.typography.quote, spec),
  } as const;

  return {
    colors: resolveColors(spec.colors),
    space: resolveSpace(spec.space),
    radii: {
      card: resolveRadii(spec.radii.card),
      pill: resolveRadii(spec.radii.pill),
    },
    typography,
    fonts: {
      primary: spec.fonts.primaryFamily,
      secondary: spec.fonts.secondaryFamily,
    },
    layout: {
      containerMaxWidth: spec.layout.containerMaxWidth,
      controlColumnMinWidth: spec.layout.controlColumnMinWidth,
      secondaryColumnMinWidth: spec.layout.secondaryColumnMinWidth,
      inlinePadding: resolveInlinePadding(spec.layout.inlinePadding),
      breakpoints: spec.layout.breakpoints,
    },
    palette: resolvePalette(spec.palette),
  };
}
