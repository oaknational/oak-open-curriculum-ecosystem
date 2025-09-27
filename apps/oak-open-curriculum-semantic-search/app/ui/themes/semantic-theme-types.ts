import type {
  OakBorderRadiusToken,
  OakColorToken,
  OakFontToken,
  OakInnerPaddingToken,
  OakSpaceBetweenToken,
  OakUiRoleToken,
} from '@oaknational/oak-components';

/**
 * The two supported semantic theme modes.
 */
export type SemanticMode = 'light' | 'dark';

/**
 * Describes typography entries in the semantic theme spec.
 */
export interface SemanticTypographySpecEntry {
  /**
   * Oak typography token that provides font size, weight, and letter spacing.
   */
  readonly token: OakFontToken;
  /**
   * Dimensionless line-height multiplier to preserve relative spacing across zoom levels.
   */
  readonly lineHeight: number;
  readonly fontFamilyOverride?: string;
  readonly fontStyle?: 'normal' | 'italic';
}

/**
 * Describes the application-specific tokens that sit alongside Oak UI colours.
 */
export interface SemanticAppSpec {
  readonly space: {
    readonly gap: Record<'grid' | 'section' | 'cluster', OakSpaceBetweenToken>;
    readonly padding: Record<'card' | 'pill', OakInnerPaddingToken>;
  };
  readonly radii: Record<'card' | 'pill', OakBorderRadiusToken>;
  readonly typography: {
    readonly hero: SemanticTypographySpecEntry;
    readonly heading: SemanticTypographySpecEntry;
    readonly subheading: SemanticTypographySpecEntry;
    readonly body: SemanticTypographySpecEntry;
    readonly bodyStrong: SemanticTypographySpecEntry;
    readonly caption: SemanticTypographySpecEntry;
    readonly quote: SemanticTypographySpecEntry;
  };
  readonly fonts: {
    readonly primaryFamily: string;
    readonly secondaryFamily: string;
  };
  readonly layout: {
    readonly containerMaxWidth: string;
    readonly controlColumnMinWidth: string;
    readonly secondaryColumnMinWidth: string;
    readonly inlinePadding: Record<'base' | 'wide', OakSpaceBetweenToken>;
    readonly breakpoints: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl', string>;
  };
  readonly colors: Record<
    | 'textPrimary'
    | 'textSubdued'
    | 'headerBorder'
    | 'borderSubtle'
    | 'textMuted'
    | 'errorText'
    | 'pageNote'
    | 'docsNote'
    | 'surfaceCard'
    | 'surfaceRaised',
    OakColorToken
  > & {
    readonly surfaceEmphasisBg: string;
  };
  readonly palette: {
    readonly brandPrimary: string;
    readonly brandPrimaryDark: string;
    readonly brandPrimaryDeep: string;
    readonly brandPrimaryBright: string;
  };
}

export interface SemanticThemeDefinition {
  readonly name: string;
  readonly uiColors: Record<OakUiRoleToken, OakColorToken>;
  readonly app: SemanticAppSpec;
}
