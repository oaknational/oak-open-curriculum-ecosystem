import { useMemo } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeCssVars } from './ThemeCssVars';
import { buildTokens } from '../../ui/themes/tokens';
import { oakDefaultTheme, type OakTheme } from '@oaknational/oak-components';
import type { AppTokens } from '../../ui/themes/tokens';
import { createLightTheme } from '../../ui/themes/light';
import { createDarkTheme } from '../../ui/themes/dark';
import { useColorMode } from './ColorModeContext';

type SemanticTheme = ReturnType<typeof createSemanticTheme>;

function resolveModeFromDom(): 'light' | 'dark' {
  try {
    if (typeof document !== 'undefined') {
      return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    }
  } catch {
    /* ignore */
  }
  return 'light';
}

function createSemanticTheme(raw: OakTheme, mode: 'light' | 'dark') {
  const appBase: AppTokens = buildTokens();
  const themedApp = mode === 'dark' ? createDarkTheme().app : createLightTheme().app;
  return { ...raw, app: { ...appBase, ...themedApp } } as const;
}

function buildVarMap(mode: 'light' | 'dark'): Record<string, string> {
  const t = mode === 'dark' ? createDarkTheme().app : createLightTheme().app;
  return {
    '--app-space-xs': t.space.xs,
    '--app-space-sm': t.space.sm,
    '--app-space-md': t.space.md,
    '--app-space-lg': t.space.lg,
    '--app-space-xl': t.space.xl,
    '--app-radius-sm': t.radii.sm,
    '--app-radius-md': t.radii.md,
    '--app-color-border-subtle': t.colors.borderSubtle,
    '--app-color-header-border': t.colors.headerBorder,
    '--app-color-text-muted': t.colors.textMuted,
    '--app-color-error-text': t.colors.errorText,
  };
}

export function ThemeBridgeProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const raw = oakDefaultTheme;
  const contextMode = useColorMode().mode;
  const mode = typeof document === 'undefined' ? 'light' : (contextMode ?? resolveModeFromDom());
  const semantic = useMemo<SemanticTheme>(() => createSemanticTheme(raw, mode), [raw, mode]);
  const vars = useMemo(() => buildVarMap(mode), [mode]);
  return (
    <>
      <ThemeCssVars vars={vars} />
      <StyledThemeProvider theme={semantic}>{children}</StyledThemeProvider>
    </>
  );
}
