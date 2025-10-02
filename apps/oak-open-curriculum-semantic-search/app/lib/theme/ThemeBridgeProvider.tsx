import { useMemo, type JSX } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createLightTheme } from '../../ui/themes/light';
import { createDarkTheme } from '../../ui/themes/dark';
import type { SemanticMode } from '../../ui/themes/semantic-theme-spec';
import { ThemeCssVars } from './ThemeCssVars';
import { ThemeGlobalStyle } from './ThemeGlobalStyle';
import { useColorMode } from './ColorModeContext';

const THEMES = {
  light: createLightTheme(),
  dark: createDarkTheme(),
} as const;

type SemanticTheme = (typeof THEMES)[keyof typeof THEMES];

type Mode = SemanticMode;

function resolveModeFromDom(): Mode {
  try {
    if (typeof document !== 'undefined') {
      const root = document.getElementById('app-theme-root');
      if (root?.dataset.theme === 'dark') {
        return 'dark';
      }
    }
  } catch {
    /* ignore */
  }
  return 'light';
}

function selectTheme(mode: Mode): SemanticTheme {
  return THEMES[mode];
}

function buildVarMap(theme: SemanticTheme): Record<string, string> {
  const { app } = theme;
  return {
    ...buildSpaceVars(app),
    ...buildRadiusVars(app),
    ...buildColorVars(app),
    ...buildFontVars(app),
    ...buildTypographyVars(app),
    ...buildLayoutVars(app),
    ...buildPaletteVars(app),
  };
}

function buildSpaceVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-gap-grid': app.space.gap.grid,
    '--app-gap-section': app.space.gap.section,
    '--app-gap-cluster': app.space.gap.cluster,
    '--app-gap-stack': app.space.gap.stack,
    '--app-padding-card': app.space.padding.card,
    '--app-padding-pill': app.space.padding.pill,
  };
}

function buildRadiusVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-radius-card': app.radii.card,
    '--app-radius-pill': app.radii.pill,
  };
}

function buildColorVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-color-border-subtle': app.colors.borderSubtle,
    '--app-color-header-border': app.colors.headerBorder,
    '--app-color-text-muted': app.colors.textMuted,
    '--app-color-error-text': app.colors.errorText,
    '--app-color-page-note': app.colors.pageNote,
    '--app-color-docs-note': app.colors.docsNote,
    '--app-color-surface-emphasis-bg': app.colors.surfaceEmphasisBg,
    '--app-color-surface-card': app.colors.surfaceCard,
    '--app-color-surface-raised': app.colors.surfaceRaised,
  };
}

function buildFontVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-font-primary': app.fonts.primary,
    '--app-font-secondary': app.fonts.secondary,
  };
}

function buildTypographyVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-typography-hero-size': app.typography.hero.fontSizeRem,
    '--app-typography-hero-line-height': String(app.typography.hero.lineHeight),
    '--app-typography-hero-weight': `${app.typography.hero.fontWeight}`,
    '--app-typography-hero-letter-spacing': app.typography.hero.letterSpacing,
    '--app-typography-body-size': app.typography.body.fontSizeRem,
    '--app-typography-body-line-height': String(app.typography.body.lineHeight),
    '--app-typography-body-weight': `${app.typography.body.fontWeight}`,
    '--app-typography-body-letter-spacing': app.typography.body.letterSpacing,
    '--app-typography-quote-size': app.typography.quote.fontSizeRem,
    '--app-typography-quote-line-height': String(app.typography.quote.lineHeight),
    '--app-typography-quote-family': app.typography.quote.fontFamily,
    '--app-typography-quote-style': app.typography.quote.fontStyle,
  };
}

function buildLayoutVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-layout-container-max-width': app.layout.containerMaxWidth,
    '--app-layout-control-column-min-width': app.layout.controlColumnMinWidth,
    '--app-layout-secondary-column-min-width': app.layout.secondaryColumnMinWidth,
    '--app-layout-inline-padding-base': app.layout.inlinePadding.base,
    '--app-layout-inline-padding-wide': app.layout.inlinePadding.wide,
    '--app-bp-xs': app.layout.breakpoints.xs,
    '--app-bp-sm': app.layout.breakpoints.sm,
    '--app-bp-md': app.layout.breakpoints.md,
    '--app-bp-lg': app.layout.breakpoints.lg,
    '--app-bp-xl': app.layout.breakpoints.xl,
    '--app-bp-xxl': app.layout.breakpoints.xxl,
  };
}

function buildPaletteVars(app: SemanticTheme['app']): Record<string, string> {
  return {
    '--app-color-brand-primary': app.palette.brandPrimary,
    '--app-color-brand-primary-dark': app.palette.brandPrimaryDark,
    '--app-color-brand-primary-deep': app.palette.brandPrimaryDeep,
    '--app-color-brand-primary-bright': app.palette.brandPrimaryBright,
  };
}

export function ThemeBridgeProvider({
  children,
  ssrMode,
}: {
  children: React.ReactNode;
  ssrMode?: Mode;
}): JSX.Element {
  const contextMode = useColorMode().mode;
  const initial = ssrMode ?? resolveModeFromDom();
  const mode: Mode = contextMode ?? initial;

  const semantic = useMemo<SemanticTheme>(() => selectTheme(mode), [mode]);
  const vars = useMemo(() => buildVarMap(semantic), [semantic]);

  return (
    <>
      <ThemeCssVars vars={vars} />
      <ThemeGlobalStyle theme={semantic} />
      <StyledThemeProvider theme={semantic}>{children}</StyledThemeProvider>
    </>
  );
}
