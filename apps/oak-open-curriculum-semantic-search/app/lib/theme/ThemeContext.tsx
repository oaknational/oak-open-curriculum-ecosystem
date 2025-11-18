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
import { OakGlobalStyle, OakThemeProvider } from '@oaknational/oak-components';

import {
  UnifiedLogger,
  buildResourceAttributes,
  logLevelToSeverityNumber,
} from '@oaknational/mcp-logger';
import { createLightTheme } from '../../ui/themes/light';
import { createDarkTheme } from '../../ui/themes/dark';
import type { AppTheme } from '../../ui/themes/types';

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

export { THEME_MODES };
export type { ResolvedThemeMode, ThemeMode };

/** @todo centralise logger creation */
const logger = new UnifiedLogger({
  minSeverity: logLevelToSeverityNumber('INFO'),
  resourceAttributes: buildResourceAttributes({}, 'ThemeContext', '1.0.0'),
  context: {},
  stdoutSink: { write: (line: string) => console.log(line) }, // Browser console
  fileSink: null,
});

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (next: ThemeMode) => void;
  resolved: ResolvedThemeMode;
}

const Ctx = createContext<ThemeContextValue | null>(null);

export function useThemeContext(): ThemeContextValue {
  const v = useContext(Ctx);
  if (!v) {
    throw new Error('ThemeContext not available');
  }
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
    if (mode !== THEME_MODES.system) {
      return undefined;
    }
    const prefersDark = getSystemPrefersDark();
    setSystemPrefersDark(prefersDark);
    const unsubscribe = subscribeToSystemPrefersDark((prefers) => setSystemPrefersDark(prefers));
    return unsubscribe;
  }, [mode, setSystemPrefersDark]);
}

function useAppTheme(resolved: ResolvedThemeMode): AppTheme {
  return useMemo(() => {
    const theme = resolved === 'dark' ? createDarkTheme() : createLightTheme();
    logger.debug('Changing theme to:', { resolved });
    return theme;
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
  const normalisedInitialMode = isThemeMode(initialMode) ? initialMode : THEME_MODES.system;
  const initialResolvedForRender = resolveMode(normalisedInitialMode, () => false);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(
    () => initialResolvedForRender === THEME_MODES.dark,
  );

  const setMode = useCallback((next: ThemeMode) => {
    if (!isThemeMode(next)) {
      return;
    }
    setModeState(next);
    try {
      // Persist for client convenience and SSR hint via cookie
      setStoredThemeMode(next);
      document.cookie = makeThemeCookie(next);
      // Log contrast preference requests for telemetry/diagnostics (no-op if unchanged)
      void getContrastPreference();
    } catch (error: unknown) {
      logger.error('Error setting theme mode:', error instanceof Error ? error : undefined);
      // ignore
    }
  }, []);

  const resolved: ResolvedThemeMode = useResolvedModeValue(mode, systemPrefersDark);
  useSystemPreferenceSync(mode, setSystemPrefersDark);
  const theme: AppTheme = useAppTheme(resolved);

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
