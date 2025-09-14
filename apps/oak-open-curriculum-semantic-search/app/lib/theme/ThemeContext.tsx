'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type JSX,
} from 'react';
import {
  OakGlobalStyle,
  OakThemeProvider,
  oakDefaultTheme,
  type OakTheme,
} from '@oaknational/oak-components';

import { createAdaptiveLogger } from '@oaknational/mcp-logger';

import {
  THEME_MODES,
  isThemeMode,
  resolveMode,
  makeThemeCookie,
  getSystemPrefersDark,
  getContrastPreference,
  subscribeToSystemPrefersDark,
  setStoredThemeMode,
  type ResolvedThemeMode,
  type ThemeMode,
} from './theme-utils';

/** @todo centralise logger creation */
const logger = createAdaptiveLogger({ name: 'ThemeContext' });

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  resolved: ResolvedThemeMode;
};

const Ctx = createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('ThemeContext not available');
  return v;
}

function useResolvedModeValue(mode: ThemeMode, systemPrefersDark: boolean): ResolvedThemeMode {
  return useMemo(() => resolveMode(mode, () => systemPrefersDark), [mode, systemPrefersDark]);
}

function useSystemPreferenceSync(
  mode: ThemeMode,
  setSystemPrefersDark: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  useEffect(() => {
    if (mode !== THEME_MODES.system) return undefined;
    const unsubscribe = subscribeToSystemPrefersDark((prefers) => setSystemPrefersDark(prefers));
    return unsubscribe;
  }, [mode, setSystemPrefersDark]);
}

function useOakTheme(resolved: ResolvedThemeMode): OakTheme {
  return useMemo(() => {
    // For now, keep Oak default theme for both; wire in dark variant when available/derived
    // Oak theme is token driven; once a dark theme is provided/derived, swap here by `resolved`.
    logger.debug('Changing theme to:', { resolved });
    return oakDefaultTheme;
  }, [resolved]);
}

export function ThemeProvider({
  initialMode,
  children,
}: {
  initialMode: ThemeMode;
  children: React.ReactNode;
}): JSX.Element {
  const [mode, setModeState] = useState<ThemeMode>(
    isThemeMode(initialMode) ? initialMode : THEME_MODES.system,
  );
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => getSystemPrefersDark());

  const setMode = useCallback((next: ThemeMode) => {
    if (!isThemeMode(next)) return;
    setModeState(next);
    try {
      // Persist for client convenience and SSR hint via cookie
      setStoredThemeMode(next);
      document.cookie = makeThemeCookie(next);
      // Log contrast preference requests for telemetry/diagnostics (no-op if unchanged)
      void getContrastPreference();
    } catch (error: unknown) {
      logger.error('Error setting theme mode:', { error });
      // ignore
    }
  }, []);

  const resolved: ResolvedThemeMode = useResolvedModeValue(mode, systemPrefersDark);
  useSystemPreferenceSync(mode, setSystemPrefersDark);
  const theme: OakTheme = useOakTheme(resolved);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, resolved }),
    [mode, setMode, resolved],
  );

  return (
    <Ctx.Provider value={value}>
      <OakGlobalStyle />
      <OakThemeProvider theme={theme}>{children}</OakThemeProvider>
    </Ctx.Provider>
  );
}
