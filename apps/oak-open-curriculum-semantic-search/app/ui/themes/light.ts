import type { AppTheme } from './types';
import { resolveAppTokens } from './semantic-theme-resolver';
import { semanticThemeSpec } from './semantic-theme-spec';

export function createLightTheme(): AppTheme {
  return {
    name: semanticThemeSpec.light.name,
    uiColors: semanticThemeSpec.light.uiColors,
    app: resolveAppTokens('light'),
  };
}
