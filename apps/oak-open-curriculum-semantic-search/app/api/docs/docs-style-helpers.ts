import { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';
import { getAppTheme } from '../../ui/themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';
import { docsCodeTokenStyles } from './docs-css-code';
import { docsControlStyles } from './docs-css-controls';
import { docsContentStyles, docsStructureStyles } from './docs-css-structure';
import { docsVariableStyles } from './docs-css-variables';
import type { DocsStyleTokens } from './docs-theme-tokens';

export function resolveDocsSurfaces(appTheme: ReturnType<typeof getAppTheme>): {
  surface: string;
  surfaceAlt: string;
  border: string;
} {
  const surface = appTheme.app.colors.surfaceCard;
  const surfaceAlt = appTheme.app.colors.surfaceRaised;
  const border = appTheme.app.colors.borderSubtle;

  return {
    surface,
    surfaceAlt,
    border,
  } as const;
}

export function buildDocsWrapperStyles(theme: DefaultTheme): ReturnType<typeof css> {
  const tokens = createDocsStyleTokens(getAppTheme(theme));

  return css`
    ${docsVariableStyles(tokens)}
    ${docsStructureStyles(tokens)}
    ${docsContentStyles(tokens)}
    ${docsControlStyles(tokens)}
    ${docsCodeTokenStyles()}
  `;
}

function createDocsStyleTokens(appTheme: ReturnType<typeof getAppTheme>): DocsStyleTokens {
  const surfaces = resolveDocsSurfaces(appTheme);
  const textPrimary = resolveUiColor(appTheme, 'text-primary');

  return {
    surfaces: {
      surface: surfaces.surface,
      surfaceAlt: surfaces.surfaceAlt,
      border: surfaces.border,
      emphasis: appTheme.app.colors.surfaceEmphasisBg,
    },
    text: {
      primary: textPrimary,
      subdued: resolveUiColor(appTheme, 'text-subdued'),
      muted: appTheme.app.colors.textMuted,
    },
    links: {
      active: resolveUiColor(appTheme, 'text-link-active'),
      hover: resolveUiColor(appTheme, 'text-link-hover'),
    },
    palette: {
      accentBorder: appTheme.app.palette.brandPrimaryBright,
    },
    code: {
      key: textPrimary,
      string: appTheme.app.palette.brandPrimaryDark,
      number: appTheme.app.palette.brandPrimaryBright,
      boolean: appTheme.app.colors.errorText,
      null: appTheme.app.colors.pageNote,
    },
    controls: {
      background: surfaces.surfaceAlt,
      hoverBackground: surfaces.surface,
      border: surfaces.border,
      text: textPrimary,
    },
    colors: {
      error: appTheme.app.colors.errorText,
    },
    radii: {
      card: appTheme.app.radii.card,
      pill: appTheme.app.radii.pill,
    },
    info: {
      method: appTheme.app.colors.methods,
      methodBorder: appTheme.app.colors.borderAccent,
    },
  };
}
