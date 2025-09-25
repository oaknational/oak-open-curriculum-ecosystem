import { oakColorTokens, oakDefaultTheme, oakUiRoleTokens } from '@oaknational/oak-components';
import type {
  OakColorToken,
  OakInnerPaddingToken,
  OakSpaceBetweenToken,
  OakUiRoleToken,
  OakFontToken,
  OakBorderRadiusToken,
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
  };
  readonly colors: Record<
    'headerBorder' | 'borderSubtle' | 'textMuted' | 'errorText' | 'pageNote' | 'docsNote',
    OakColorToken
  > & {
    readonly surfaceEmphasisBg: string;
  };
}

export interface SemanticThemeDefinition {
  readonly name: string;
  readonly uiColors: Record<OakUiRoleToken, OakColorToken>;
  readonly app: SemanticAppSpec;
}

type UiColorMap = Record<OakUiRoleToken, OakColorToken>;
type PartialUiColorMap = Partial<Record<OakUiRoleToken, OakColorToken>>;

function isOakColorToken(value: unknown): value is OakColorToken {
  return typeof value === 'string' && value in oakColorTokens;
}

function assertCompleteUiColorMap(map: PartialUiColorMap): asserts map is UiColorMap {
  for (const token of oakUiRoleTokens) {
    if (!map[token]) {
      throw new Error(`Missing Oak UI colour mapping for token "${token}"`);
    }
  }
}

function buildUiColorMap(overrides: Partial<Record<OakUiRoleToken, OakColorToken>>): UiColorMap {
  const map: PartialUiColorMap = {};
  for (const token of oakUiRoleTokens) {
    const override = overrides[token];
    const base = oakDefaultTheme.uiColors[token];
    const value = override ?? (isOakColorToken(base) ? base : undefined);
    if (!value) {
      throw new Error(`Missing Oak UI colour mapping for token "${token}"`);
    }
    map[token] = value;
  }
  assertCompleteUiColorMap(map);
  return map;
}

const sharedAppSpec: Omit<SemanticAppSpec, 'colors'> = {
  space: {
    gap: {
      grid: 'space-between-m',
      section: 'space-between-xl',
      cluster: 'space-between-s',
    },
    padding: {
      card: 'inner-padding-l',
      pill: 'inner-padding-xs',
    },
  },
  radii: {
    card: 'border-radius-m2',
    pill: 'border-radius-xl',
  },
  typography: {
    hero: {
      token: 'heading-3',
      lineHeight: 56 / 48,
    },
    heading: {
      token: 'heading-4',
      lineHeight: 48 / 40,
    },
    subheading: {
      token: 'heading-5',
      lineHeight: 40 / 32,
    },
    body: {
      token: 'body-3',
      lineHeight: 28 / 20,
    },
    bodyStrong: {
      token: 'body-3-bold',
      lineHeight: 28 / 20,
    },
    caption: {
      token: 'body-4',
      lineHeight: 20 / 16,
    },
    quote: {
      token: 'heading-light-4',
      lineHeight: 48 / 40,
      fontFamilyOverride: '"Work Sans", sans-serif',
      fontStyle: 'italic',
    },
  },
  fonts: {
    primaryFamily: '"Lexend", sans-serif',
    secondaryFamily: '"Work Sans", sans-serif',
  },
  layout: {
    containerMaxWidth: '72rem',
  },
};

export const semanticThemeSpec: Record<SemanticMode, SemanticThemeDefinition> = {
  light: {
    name: 'oak-semantic-light',
    uiColors: buildUiColorMap({
      'text-primary': 'navy120',
      'text-subdued': 'grey60',
      'text-link-active': 'navy',
      'text-link-hover': 'navy110',
      'text-link-pressed': 'navy120',
      'text-link-visited': 'lavender110',
      'bg-primary': 'white',
      'bg-neutral': 'grey20',
      'bg-neutral-stronger': 'grey30',
      'bg-btn-primary': 'navy',
      'bg-btn-primary-hover': 'navy110',
      'bg-btn-primary-disabled': 'grey40',
      'bg-btn-secondary': 'white',
      'bg-btn-secondary-hover': 'grey20',
      'bg-btn-secondary-disabled': 'grey30',
      'bg-icon': 'grey20',
      'bg-icon-hover': 'grey30',
      'icon-main': 'navy120',
      'icon-inverted': 'white',
      'border-neutral': 'grey30',
      'border-neutral-lighter': 'grey20',
      'border-primary': 'navy120',
      'border-brand': 'oakGreen',
    }),
    app: {
      ...sharedAppSpec,
      colors: {
        headerBorder: 'grey30',
        borderSubtle: 'grey20',
        textMuted: 'grey60',
        errorText: 'red',
        pageNote: 'navy120',
        docsNote: 'navy110',
        surfaceEmphasisBg: 'rgba(0, 0, 0, 0.06)',
      },
    },
  },
  dark: {
    name: 'oak-semantic-dark',
    uiColors: buildUiColorMap({
      'text-primary': 'white',
      'text-subdued': 'grey30',
      'text-link-active': 'mint',
      'text-link-hover': 'mint110',
      'text-link-pressed': 'mint50',
      'text-link-visited': 'lavender50',
      'text-inverted': 'navy120',
      'bg-primary': 'navy120',
      'bg-neutral': 'navy110',
      'bg-neutral-stronger': 'navy',
      'bg-btn-primary': 'amber',
      'bg-btn-primary-hover': 'amber50',
      'bg-btn-primary-disabled': 'grey60',
      'bg-btn-secondary': 'navy',
      'bg-btn-secondary-hover': 'navy110',
      'bg-btn-secondary-disabled': 'navy120',
      'bg-icon': 'navy110',
      'bg-icon-hover': 'navy',
      'icon-main': 'white',
      'icon-inverted': 'navy120',
      'border-neutral': 'navy110',
      'border-neutral-lighter': 'navy',
      'border-primary': 'amber',
      'border-brand': 'amber',
    }),
    app: {
      ...sharedAppSpec,
      colors: {
        headerBorder: 'navy110',
        borderSubtle: 'navy',
        textMuted: 'grey30',
        errorText: 'amber50',
        pageNote: 'white',
        docsNote: 'grey20',
        surfaceEmphasisBg: 'rgba(255, 255, 255, 0.08)',
      },
    },
  },
} as const;
