'use client';

import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import {
  OakThemeProvider,
  OakGlobalStyle,
  oakDefaultTheme,
  type OakTheme,
} from '@oaknational/oak-components';

type ThemeMode = 'light' | 'dark' | 'system';

function readSsrHint(): ThemeMode | null {
  if (typeof document === 'undefined') return null;
  const m = /(?:^|; )theme-mode=([^;]+)/.exec(document.cookie);
  if (!m) return null;
  const val = decodeURIComponent(m[1]);
  return val === 'light' || val === 'dark' || val === 'system' ? val : null;
}

function computeTheme(): OakTheme {
  // Colour mode is applied via data-theme; theme object currently does not vary by mode.
  return oakDefaultTheme;
}

export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(() => readSsrHint() ?? 'system');
  const [theme, setTheme] = useState<OakTheme>(() => computeTheme());

  useEffect(() => {
    setTheme(computeTheme());
  }, [mode]);

  useEffect(() => {
    // Keep in sync with changes from ThemeSelect if they occur after mount
    const saved = window.localStorage.getItem('theme-mode') as ThemeMode | null;
    if (saved && saved !== mode) setMode(saved);
  }, [mode]);

  return (
    <>
      <OakGlobalStyle />
      <OakThemeProvider theme={theme}>{children}</OakThemeProvider>
    </>
  );
}
