import type { DefaultTheme } from 'styled-components';
import { getAppTheme } from '../themes/app-theme-helpers';

export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Resolves the CSS breakpoint value for the supplied semantic breakpoint token.
 */
export function resolveBreakpoint(themeOrThemeLike: DefaultTheme, name: BreakpointName): string {
  const theme = getAppTheme(themeOrThemeLike);
  return theme.app.layout.breakpoints[name];
}
