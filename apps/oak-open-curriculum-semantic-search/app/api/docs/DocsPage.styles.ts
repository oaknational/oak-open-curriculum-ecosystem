import { OakBox } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { getAppTheme } from '../../ui/themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

/**
 * Resolves the surfaces for the docs page.
 * @param appTheme The app theme to resolve the surfaces for.
 * @returns The resolved surfaces.
 *
 * @remarks
 * Figure out why this function is specifying dark mode values
 * outside of the theme, which should already handle this.
 */
export function resolveDocsSurfaces(appTheme: ReturnType<typeof getAppTheme>): {
  surface: string;
  surfaceAlt: string;
  border: string;
} {
  const isDarkMode = appTheme.name.includes('dark');
  const surface = isDarkMode
    ? resolveUiColor(appTheme, 'bg-neutral')
    : appTheme.app.colors.surfaceCard;
  const surfaceAlt = isDarkMode
    ? resolveUiColor(appTheme, 'bg-primary')
    : appTheme.app.colors.surfaceRaised;
  const border = isDarkMode
    ? resolveUiColor(appTheme, 'border-neutral')
    : appTheme.app.colors.borderSubtle;

  return {
    surface,
    surfaceAlt,
    border,
  } as const;
}

export const PageContainer = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
  width: min(100%, var(--app-layout-container-max-width));
  max-width: min(100%, var(--app-layout-container-max-width));
  margin-inline: auto;
  padding-inline: clamp(
    var(--app-layout-inline-padding-base),
    4vw,
    var(--app-layout-inline-padding-wide)
  );
  padding-block: var(--app-gap-cluster);

  @media (min-width: var(--app-bp-lg)) {
    padding-block: var(--app-gap-section);
  }
`;

export const HeaderSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
`;

/* eslint-disable max-lines-per-function */
export const DocsWrapper = styledComponents(OakBox)`
  ${({ theme }) => {
    const appTheme = getAppTheme(theme);
    const { colors, palette, radii } = appTheme.app;
    const surfaces = resolveDocsSurfaces(appTheme);
    const surfaceEmphasis = colors.surfaceEmphasisBg;
    const borderColour = surfaces.border;
    const buttonBorder = palette.brandPrimaryBright;
    const textPrimary = resolveUiColor(appTheme, 'text-primary');
    const textSubdued = resolveUiColor(appTheme, 'text-subdued');
    const textMuted = colors.textMuted;
    const linkActive = resolveUiColor(appTheme, 'text-link-active');
    const linkHover = resolveUiColor(appTheme, 'text-link-hover');

    return css`
      --docs-surface: ${surfaces.surface};
      --docs-surface-alt: ${surfaces.surfaceAlt};
      --docs-surface-emphasis: ${surfaceEmphasis};
      --docs-text-primary: ${textPrimary};
      --docs-text-subdued: ${textSubdued};
      --docs-text-muted: ${textMuted};
      --docs-border: ${borderColour};
      --docs-link: ${linkActive};
      --docs-link-hover: ${linkHover};
      --docs-accent-border: ${buttonBorder};

      border-radius: ${radii.card};
      border: 1px solid var(--docs-border);
      overflow: hidden;
      background-color: var(--docs-surface);
      color: var(--docs-text-primary);
      min-height: clamp(40rem, 70vh, 72rem);
      box-shadow: 0 1rem 2.5rem rgba(0, 0, 0, 0.08);

      a {
        color: var(--docs-link);
      }

      a:hover,
      a:focus {
        color: var(--docs-link-hover);
      }

      .redoc-wrap,
      .redoc-wrap .api-content,
      .redoc-wrap .menu-content {
        background-color: var(--docs-surface);
        color: var(--docs-text-primary);
      }

      .redoc-wrap {
        background-color: var(--docs-surface);
      }

      .redoc-wrap .menu-content {
        background-color: var(--docs-surface-alt);
        border-right: 1px solid var(--docs-border);
      }

      .redoc-wrap .menu-content * {
        color: inherit;
      }

      .redoc-wrap h1,
      .redoc-wrap h2,
      .redoc-wrap h3,
      .redoc-wrap h4,
      .redoc-wrap h5,
      .redoc-wrap h6,
      .redoc-wrap p,
      .redoc-wrap li {
        color: var(--docs-text-primary);
      }

      .redoc-wrap small,
      .redoc-wrap .menu-content p,
      .redoc-wrap .menu-content li,
      .redoc-wrap .api-info p {
        color: var(--docs-text-subdued);
      }

      .redoc-wrap .api-info small {
        color: var(--docs-text-muted);
      }

      .redoc-wrap pre,
      .redoc-wrap code {
        background-color: var(--docs-surface-alt);
        color: var(--docs-text-primary);
        border-radius: ${radii.card};
      }

      .redoc-wrap pre {
        border: 1px solid var(--docs-border);
      }

      .redoc-wrap table {
        background-color: var(--docs-surface);
        color: var(--docs-text-primary);
        border: 1px solid var(--docs-border);
      }

      .redoc-wrap th,
      .redoc-wrap td {
        border-color: var(--docs-border);
      }

      .redoc-wrap .http-verb,
      .redoc-wrap [class*='badge'],
      .redoc-wrap [class*='label'] {
        background-color: var(--docs-surface-emphasis);
        color: var(--docs-text-primary);
        border: 1px solid var(--docs-accent-border);
      }

      .redoc-wrap ul.react-tabs__tab-list li.react-tabs__tab {
        margin: 1em;
        border: 1px solid var(--docs-accent-border);
        background-color: var(--docs-surface);
        color: var(--docs-text-primary);
      }

      .redoc-wrap ul.react-tabs__tab-list li.react-tabs__tab.react-tabs__tab--selected {
        background-color: var(--docs-surface-alt);
      }
    `;
  }}
`;
/* eslint-enable max-lines-per-function */
