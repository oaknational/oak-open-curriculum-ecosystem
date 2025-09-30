import type { AppTheme } from './types';
import { resolveAppTokens } from './semantic-theme-resolver';
import { semanticThemeSpec } from './semantic-theme-spec';

export function createDarkTheme(): AppTheme {
  return {
    name: semanticThemeSpec.dark.name,
    uiColors: semanticThemeSpec.dark.uiColors,
    app: resolveAppTokens('dark'),
  };
}
