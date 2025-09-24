import { oakDefaultTheme } from '@oaknational/oak-components';
import { buildTokens } from './tokens';
import type { AppTheme } from './types';

export function createLightTheme(): AppTheme {
  const base = oakDefaultTheme;
  return {
    ...base,
    app: buildTokens(),
  };
}
