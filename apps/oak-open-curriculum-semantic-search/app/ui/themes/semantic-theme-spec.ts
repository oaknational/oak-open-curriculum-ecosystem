import { oakColorTokens, oakDefaultTheme, oakUiRoleTokens } from '@oaknational/oak-components';
import type { OakColorToken, OakUiRoleToken } from '@oaknational/oak-components';
import type {
  SemanticAppSpec,
  SemanticMode,
  SemanticThemeDefinition,
} from './semantic-theme-types';

export type {
  SemanticMode,
  SemanticAppSpec,
  SemanticThemeDefinition,
  SemanticTypographySpecEntry,
} from './semantic-theme-types';

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
    containerMaxWidth: 'clamp(20rem, 92vw, 78rem)',
    controlColumnMinWidth: '20rem',
    secondaryColumnMinWidth: '18rem',
    inlinePadding: {
      base: 'space-between-l',
      wide: 'space-between-xl',
    },
    breakpoints: {
      xs: '0px',
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1360px',
      xxl: '1760px',
    },
  },
  palette: {
    brandPrimary: oakColorTokens.oakGreen,
    brandPrimaryDark: '#0f381b',
    brandPrimaryDeep: '#144d24',
    brandPrimaryBright: '#35a04c',
  },
};

export const semanticThemeSpec: Record<SemanticMode, SemanticThemeDefinition> = {
  light: {
    name: 'oak-semantic-light',
    uiColors: buildUiColorMap({
      'text-primary': 'navy120',
      'text-subdued': 'grey60',
      'text-link-active': 'oakGreen',
      'text-link-hover': 'mint110',
      'text-link-pressed': 'oakGreen',
      'text-link-visited': 'lavender110',
      'bg-primary': 'mint30',
      'bg-neutral': 'grey20',
      'bg-neutral-stronger': 'grey30',
      'bg-btn-primary': 'oakGreen',
      'bg-btn-primary-hover': 'mint110',
      'bg-btn-primary-disabled': 'grey40',
      'bg-btn-secondary': 'white',
      'bg-btn-secondary-hover': 'grey20',
      'bg-btn-secondary-disabled': 'grey30',
      'bg-icon': 'grey20',
      'bg-icon-hover': 'grey30',
      'icon-main': 'oakGreen',
      'icon-inverted': 'white',
      'border-neutral': 'grey30',
      'border-neutral-lighter': 'grey20',
      'border-primary': 'oakGreen',
      'border-brand': 'oakGreen',
    }),
    app: {
      ...sharedAppSpec,
      colors: {
        textPrimary: 'navy120',
        textSubdued: 'grey60',
        headerBorder: 'oakGreen',
        borderSubtle: 'grey20',
        textMuted: 'grey60',
        errorText: 'red',
        pageNote: 'navy110',
        docsNote: 'navy110',
        surfaceEmphasisBg: 'rgba(0, 0, 0, 0.06)',
        surfaceCard: 'white',
        surfaceRaised: 'grey20',
      },
      palette: {
        brandPrimary: oakColorTokens.oakGreen,
        brandPrimaryDark: '#0f381b',
        brandPrimaryDeep: '#144d24',
        brandPrimaryBright: '#35a04c',
      },
    },
  },
  dark: {
    name: 'oak-semantic-dark',
    uiColors: buildUiColorMap({
      'text-primary': 'grey10',
      'text-subdued': 'grey30',
      'text-link-active': 'rpf-syntax-pink',
      'text-link-hover': 'mint50',
      'text-link-pressed': 'mint30',
      'text-link-visited': 'lavender50',
      'text-inverted': 'mint30',
      'bg-primary': 'grey80',
      'bg-neutral': 'grey70',
      'bg-neutral-stronger': 'navy',
      'bg-btn-primary': 'oakGreen',
      'bg-btn-primary-hover': 'mint50',
      'bg-btn-primary-disabled': 'grey60',
      'bg-btn-secondary': 'navy',
      'bg-btn-secondary-hover': 'navy110',
      'bg-btn-secondary-disabled': 'navy120',
      'bg-icon': 'navy110',
      'bg-icon-hover': 'navy',
      'icon-main': 'mint',
      'icon-inverted': 'navy120',
      'border-neutral': 'navy110',
      'border-neutral-lighter': 'navy',
      'border-primary': 'pink110',
      'border-brand': 'oakGreen',
    }),
    app: {
      ...sharedAppSpec,
      colors: {
        textPrimary: 'grey10',
        textMuted: 'grey20',
        textSubdued: 'grey30',
        headerBorder: 'oakGreen',
        borderSubtle: 'rpf-syntax-blue',
        errorText: 'amber50',
        pageNote: 'mint50',
        docsNote: 'mint50',
        surfaceEmphasisBg: 'black',
        surfaceCard: 'navy110',
        surfaceRaised: 'navy120',
      },
      palette: {
        brandPrimary: oakColorTokens.mint,
        brandPrimaryDark: '#82d88a',
        brandPrimaryDeep: oakColorTokens.oakGreen,
        brandPrimaryBright: oakColorTokens['rpf-syntax-pink'],
      },
    },
  },
} as const;
