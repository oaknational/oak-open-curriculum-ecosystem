// Client provider composition for app-wide context.
'use client';

import type { JSX } from 'react';
import { ThemeProvider as ThemeContextProvider, useThemeContext } from './theme/ThemeContext';
import { ColorModeProvider } from './theme/ColorModeContext';
import { ThemeBridgeProvider } from './theme/ThemeBridgeProvider';
import { HtmlThemeAttribute } from './theme/HtmlThemeAttribute';

function BridgeComposer({ children }: { children: React.ReactNode }): JSX.Element {
  const { resolved } = useThemeContext();
  return (
    <ColorModeProvider initialMode={resolved} key={resolved}>
      <ThemeBridgeProvider>
        <HtmlThemeAttribute />
        {children}
      </ThemeBridgeProvider>
    </ColorModeProvider>
  );
}

export function Providers({
  initialMode,
  children,
}: {
  initialMode: 'light' | 'dark' | 'system';
  children: React.ReactNode;
}): JSX.Element {
  return (
    <ThemeContextProvider initialMode={initialMode}>
      <BridgeComposer>{children}</BridgeComposer>
    </ThemeContextProvider>
  );
}

export type { JSX };
