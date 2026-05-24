import {
  oakTerminalThemes,
  type OakTerminalTheme,
} from '@oaknational/oak-design-tokens/terminal-theme';
import { createContext, useContext, type ReactNode } from 'react';

/** Props for the Oak terminal theme provider. */
export interface OakInkThemeProviderProps {
  readonly mode?: OakTerminalTheme['mode'];
  readonly children: ReactNode;
}

const OakInkThemeContext = createContext<OakTerminalTheme>(oakTerminalThemes.dark);

/** Provide the resolved Oak terminal theme to reusable Ink primitives. */
export function OakInkThemeProvider({
  mode = 'dark',
  children,
}: OakInkThemeProviderProps): React.JSX.Element {
  return (
    <OakInkThemeContext.Provider value={oakTerminalThemes[mode]}>
      {children}
    </OakInkThemeContext.Provider>
  );
}

/** Read the current Oak terminal theme. */
export function useOakInkTheme(): OakTerminalTheme {
  return useContext(OakInkThemeContext);
}
