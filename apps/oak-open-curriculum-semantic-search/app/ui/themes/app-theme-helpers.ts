import { useTheme, type DefaultTheme } from 'styled-components';
import type { AppTheme } from './types';

/**
 * Ensures the styled-components theme matches the semantic app theme contract.
 */
export function assertAppTheme(theme: DefaultTheme): asserts theme is AppTheme {
  if (!theme || typeof theme !== 'object' || !('app' in theme)) {
    throw new Error('App theme context is unavailable');
  }
}

/**
 * Resolves the strongly-typed semantic app theme from styled-components context.
 */
export function useAppTheme(): AppTheme {
  const theme = useTheme();
  assertAppTheme(theme);
  return theme;
}

/**
 * Convenience helper to obtain the semantic app theme when inside styled component factories.
 */
export function getAppTheme(theme: DefaultTheme): AppTheme {
  assertAppTheme(theme);
  return theme;
}
