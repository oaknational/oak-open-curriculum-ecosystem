import { OakBox, OakTypography, OakUL } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { resolveBreakpoint } from '../../shared/breakpoints';
import { getAppTheme } from '../../themes/app-theme-helpers';
import { resolveUiColor } from '../../../lib/theme/ThemeGlobalStyle';

export const ResultsSection = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  row-gap: var(--app-gap-section);
`;

export const ResultsSummaryContainer = styledComponents(OakBox).attrs({
  'data-testid': 'search-results-summary',
  'data-sticky': 'true',
})`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  margin-bottom: var(--app-gap-section);

  ${({ theme }) => {
    const lg = resolveBreakpoint(theme, 'lg');
    return css`
      @media (min-width: ${lg}) {
        position: sticky;
        top: calc(var(--app-gap-section) * 0.5);
      }
    `;
  }}
`;

export const ResultsGrid = styledComponents(OakUL).attrs({
  'data-testid': 'search-results-grid',
})`
  display: grid;
  row-gap: var(--app-gap-section);
  column-gap: var(--app-gap-grid);
  grid-template-columns: minmax(0, 1fr);

  ${({ theme }) => {
    const md = resolveBreakpoint(theme, 'md');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${md}) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      @media (min-width: ${xl}) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    `;
  }}
`;

export const ResultCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  border: 1px solid
    ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  box-shadow: 0 0.75rem 2.5rem -1.5rem
    ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};

  @media (prefers-contrast: more) {
    border-color: ${({ theme }) => getAppTheme(theme).app.colors.borderStrong};
    box-shadow: none;
    outline: 2px solid ${({ theme }) => getAppTheme(theme).app.colors.borderStrong};
    outline-offset: 2px;
  }
`;

export const ResultHeading = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
`;

export const ResultMetaList = styledComponents(OakBox)`
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
`;

export const ResultMetaBadge = styledComponents(OakTypography).attrs({ $font: 'body-4' })`
  display: inline-flex;
  align-items: center;
  padding-inline: calc(var(--app-gap-inline, var(--app-gap-cluster)) / 2);
  padding-block: 0.25rem;
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceEmphasisBg};
  color: ${({ theme }) => getAppTheme(theme).app.colors.textSubdued};

  @media (prefers-contrast: more) {
    background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
    color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
    border: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderStrong};
  }
`;

export const ResultHighlightList = styledComponents(OakUL)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
  margin-top: var(--app-gap-inline, var(--app-gap-cluster));
`;

export const ResultHighlightItem = styledComponents(OakTypography).attrs({
  as: 'li',
  $font: 'body-4',
  'data-line-clamp': '3',
})`
  color: ${({ theme }) => getAppTheme(theme).app.colors.textSubdued};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  mark {
    background: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
    color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
    font-weight: 600;
    border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
    padding-inline: 0.25rem;
    margin-inline: 0.125rem;
  }

  @media (prefers-contrast: more) {
    color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};

    mark {
      background: transparent;
      color: inherit;
      text-decoration: underline;
    }
  }
`;
