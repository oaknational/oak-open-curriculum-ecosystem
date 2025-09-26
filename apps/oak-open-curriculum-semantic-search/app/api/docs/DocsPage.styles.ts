import { OakBox } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { getAppTheme } from '../../ui/themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';

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

export const DocsWrapper = styledComponents(OakBox)`
  ${({ theme }) => {
    const appTheme = getAppTheme(theme);
    const surfaceCard = appTheme.app.colors.surfaceCard;
    const surfaceRaised = appTheme.app.colors.surfaceRaised;
    const borderColour = appTheme.app.colors.borderSubtle;
    const textPrimary = resolveUiColor(appTheme, 'text-primary');

    return css`
      border-radius: ${appTheme.app.radii.card};
      border-color: ${borderColour};
      border-width: 1px;
      border-style: solid;
      overflow: hidden;
      background-color: ${surfaceCard};
      color: ${textPrimary};
      min-height: clamp(40rem, 70vh, 72rem);

      .redoc-wrap,
      .redoc-wrap .api-content,
      .redoc-wrap .menu-content {
        background-color: ${surfaceCard};
        color: ${textPrimary};
      }

      .redoc-wrap pre,
      .redoc-wrap code {
        background-color: ${surfaceRaised};
        color: ${textPrimary};
      }
    `;
  }}
`;
