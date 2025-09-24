import { oakDefaultTheme } from '@oaknational/oak-components';
import { buildTokens } from './tokens';
import type { AppTheme } from './types';

export function createDarkTheme(): AppTheme {
  const base = oakDefaultTheme;
  // Derive dark by overriding palette-only aspects when Oak dark theme is absent.
  const app = buildTokens();
  const darkApp = {
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
