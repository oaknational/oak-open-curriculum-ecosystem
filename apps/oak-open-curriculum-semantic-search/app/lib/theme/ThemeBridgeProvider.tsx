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
  const t = theme.app;
  return {
    '--app-gap-grid': t.space.gap.grid,
    '--app-gap-section': t.space.gap.section,
    '--app-gap-cluster': t.space.gap.cluster,
    '--app-padding-card': t.space.padding.card,
    '--app-padding-pill': t.space.padding.pill,
    '--app-radius-card': t.radii.card,
    '--app-radius-pill': t.radii.pill,
    '--app-color-border-subtle': t.colors.borderSubtle,
    '--app-color-header-border': t.colors.headerBorder,
    '--app-color-text-muted': t.colors.textMuted,
    '--app-color-error-text': t.colors.errorText,
    '--app-color-page-note': t.colors.pageNote,
    '--app-color-docs-note': t.colors.docsNote,
    '--app-color-surface-emphasis-bg': t.colors.surfaceEmphasisBg,
    '--app-color-surface-card': t.colors.surfaceCard,
    '--app-color-surface-raised': t.colors.surfaceRaised,
    '--app-font-primary': t.fonts.primary,
    '--app-font-secondary': t.fonts.secondary,
    '--app-typography-hero-size': t.typography.hero.fontSizeRem,
    '--app-typography-hero-line-height': String(t.typography.hero.lineHeight),
    '--app-typography-hero-weight': `${t.typography.hero.fontWeight}`,
    '--app-typography-hero-letter-spacing': t.typography.hero.letterSpacing,
    '--app-typography-body-size': t.typography.body.fontSizeRem,
    '--app-typography-body-line-height': String(t.typography.body.lineHeight),
    '--app-typography-body-weight': `${t.typography.body.fontWeight}`,
    '--app-typography-body-letter-spacing': t.typography.body.letterSpacing,
    '--app-typography-quote-size': t.typography.quote.fontSizeRem,
    '--app-typography-quote-line-height': String(t.typography.quote.lineHeight),
    '--app-typography-quote-family': t.typography.quote.fontFamily,
    '--app-typography-quote-style': t.typography.quote.fontStyle,
    '--app-layout-container-max-width': t.layout.containerMaxWidth,
    '--app-layout-control-column-min-width': t.layout.controlColumnMinWidth,
    '--app-layout-secondary-column-min-width': t.layout.secondaryColumnMinWidth,
    '--app-color-brand-primary': t.palette.brandPrimary,
    '--app-color-brand-primary-dark': t.palette.brandPrimaryDark,
    '--app-color-brand-primary-deep': t.palette.brandPrimaryDeep,
    '--app-color-brand-primary-bright': t.palette.brandPrimaryBright,
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
