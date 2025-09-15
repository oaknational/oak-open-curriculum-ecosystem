import { oakDefaultTheme, type OakTheme } from '@oaknational/oak-components';
import { buildTokens, type AppTokens } from './tokens';

export type AppTheme = OakTheme & { app: AppTokens };

export function createDarkTheme(): AppTheme {
  const base: OakTheme = oakDefaultTheme;
  // Derive dark by overriding palette-only aspects when Oak dark theme is absent.
  const app = buildTokens();
  const darkApp: AppTokens = {
    ...app,
    colors: {
      ...app.colors,
      headerBorder: '#1f2937',
      borderSubtle: '#374151',
      textMuted: '#9ca3af',
      errorText: '#ef4444',
    },
  };
  return {
    ...base,
    app: darkApp,
  };
}
