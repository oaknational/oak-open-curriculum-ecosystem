import {
  oakAllSpacingTokens,
  oakBorderRadiusTokens,
  oakColorTokens,
  oakFontTokens,
  oakInnerPaddingTokens,
  oakSpaceBetweenTokens,
} from '@oaknational/oak-components';
import type {
  OakInnerPaddingToken,
  OakSpaceBetweenToken,
  OakColorToken,
  OakBorderRadiusToken,
  OakAllSpacingToken,
} from '@oaknational/oak-components';
import {
  semanticThemeSpec,
  type SemanticMode,
  type SemanticAppSpec,
  type SemanticTypographySpecEntry,
} from './semantic-theme-spec';

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

function resolveColorToken(token: OakColorToken): string {
  const value = oakColorTokens[token];
  if (!value) {
    throw new Error(`Unknown Oak colour token "${token}"`);
  }
  return value;
}

export interface ResolvedTypographyEntry {
  readonly fontFamily: string;
  readonly fontWeight: number;
  readonly fontStyle: 'normal' | 'italic';
  readonly fontSizeRem: string;
  readonly lineHeight: number;
  readonly letterSpacing: string;
}

export interface ResolvedAppTokens {
  readonly colors: Record<
    'headerBorder' | 'borderSubtle' | 'textMuted' | 'errorText' | 'pageNote' | 'docsNote',
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
    throw new Error(`Unknown border radius token "${token}"`);
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

function resolveColors(spec: SemanticAppSpec['colors']): ResolvedAppTokens['colors'] {
  return {
    headerBorder: resolveColorToken(spec.headerBorder),
    borderSubtle: resolveColorToken(spec.borderSubtle),
    textMuted: resolveColorToken(spec.textMuted),
    errorText: resolveColorToken(spec.errorText),
    pageNote: resolveColorToken(spec.pageNote),
    docsNote: resolveColorToken(spec.docsNote),
    surfaceEmphasisBg: spec.surfaceEmphasisBg,
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
    },
  };
}
