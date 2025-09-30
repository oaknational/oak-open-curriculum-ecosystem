// Client provider composition for app-wide context.
'use client';

import type { JSX } from 'react';
import { ThemeProvider as ThemeContextProvider, useThemeContext } from './theme/ThemeContext';
import { useEffect } from 'react';
import { ColorModeProvider, useColorMode } from './theme/ColorModeContext';
import { ThemeBridgeProvider } from './theme/ThemeBridgeProvider';

function BridgeComposer({
  children,
  ssrMode,
}: {
  children: React.ReactNode;
  ssrMode: 'light' | 'dark';
}): JSX.Element {
  return (
    <ColorModeProvider initialMode={ssrMode}>
      <ThemeBridgeProvider ssrMode={ssrMode}>
        <ThemeWrapper>
          <SyncModeToResolved />
          {children}
        </ThemeWrapper>
      </ThemeBridgeProvider>
    </ColorModeProvider>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }): JSX.Element {
  const { mode } = useColorMode();
  return (
    <div id="app-theme-root" data-theme={mode}>
      {children}
    </div>
  );
}

function SyncModeToResolved(): JSX.Element | null {
  const { resolved } = useThemeContext();
  const { mode, setMode } = useColorMode();
  useEffect(() => {
    if (resolved !== mode) {
      setMode(resolved);
    }
  }, [resolved, mode, setMode]);
  return null;
}

export function Providers({
  initialMode,
  children,
}: {
  initialMode: 'light' | 'dark' | 'system';
  children: React.ReactNode;
}): JSX.Element {
  const ssrResolved: 'light' | 'dark' = initialMode === 'dark' ? 'dark' : 'light';
  return (
    <ThemeContextProvider initialMode={initialMode}>
      <BridgeComposer ssrMode={ssrResolved}>{children}</BridgeComposer>
    </ThemeContextProvider>
  );
}

export type { JSX };
