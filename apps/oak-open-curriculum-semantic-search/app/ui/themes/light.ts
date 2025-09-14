import { oakDefaultTheme, type OakTheme } from '@oaknational/oak-components';
import { buildTokens, type AppTokens } from './tokens';

export type AppTheme = OakTheme & { app: AppTokens };

export function createLightTheme(): AppTheme {
  const base: OakTheme = oakDefaultTheme;
  return {
    ...base,
    app: buildTokens(),
  };
}
