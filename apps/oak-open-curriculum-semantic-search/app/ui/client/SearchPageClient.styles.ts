import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { getAppTheme } from '../themes/app-theme-helpers';
import { resolveUiColor } from '../../lib/theme/ThemeGlobalStyle';
import { resolveBreakpoint } from '../shared/breakpoints';

export const PageContainer = styledComponents(OakBox)`
  width: 100%;
  max-width: min(100%, var(--app-layout-container-max-width));
  box-sizing: border-box;
  padding-inline: clamp(
    var(--app-layout-inline-padding-base),
    4vw,
    var(--app-layout-inline-padding-wide)
  );
  padding-block: var(--app-gap-cluster);

  ${({ theme }) => css`
    @media (min-width: ${resolveBreakpoint(theme, 'lg')}) {
      padding-block: var(--app-gap-section);
    }
  `}
`;

export const ContentContainer = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
  width: min(100%, var(--app-layout-container-max-width));
  max-inline-size: min(100%, var(--app-layout-container-max-width));
  max-width: min(100%, var(--app-layout-container-max-width));
  margin-inline: auto;
`;

export const HeroControlsCluster = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'hero'
    'controls';

  ${({ theme }) => {
    const xl = resolveBreakpoint(theme, 'xl');
    const xxl = resolveBreakpoint(theme, 'xxl');
    return css`
      @media (min-width: ${xl}) {
        grid-template-columns:
          minmax(0, 0.9fr)
          minmax(0, 1.1fr);
        grid-template-areas: 'hero controls';
        align-items: start;
      }

      @media (min-width: ${xxl}) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    `;
  }}
`;

export const ControlsGrid = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'structured'
    'natural';
  grid-area: controls;
  align-items: stretch;

  ${({ theme }) => {
    const md = resolveBreakpoint(theme, 'md');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${md}) {
        grid-template-columns:
          minmax(var(--app-layout-control-column-min-width), 1.25fr)
          minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'structured natural';
      }

      @media (min-width: ${xl}) {
        grid-template-columns:
          minmax(var(--app-layout-control-column-min-width), 1.5fr)
          minmax(var(--app-layout-secondary-column-min-width), 1fr);
      }
    `;
  }}
`;

export const SecondaryGrid = styledComponents(OakBox)`
  display: grid;
  row-gap: var(--app-gap-section);
  column-gap: var(--app-gap-grid);
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'suggestions'
    'facets';

  ${({ theme }) => {
    const md = resolveBreakpoint(theme, 'md');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${md}) {
        grid-template-columns:
          minmax(var(--app-layout-secondary-column-min-width), 1fr)
          minmax(var(--app-layout-secondary-column-min-width), 1fr);
        grid-template-areas: 'suggestions facets';
      }

      @media (min-width: ${xl}) {
        grid-template-columns:
          minmax(var(--app-layout-secondary-column-min-width), 1fr)
          minmax(var(--app-layout-secondary-column-min-width), 1fr);
      }
    `;
  }}
`;

export const HeroCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  align-items: flex-start;
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  border-color: ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  max-inline-size: min(45ch, 100%);
  width: 100%;
  min-inline-size: 0;
  grid-area: hero;
`;

const PanelCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  border-color: ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  width: 100%;
  min-inline-size: 0;
`;

export const StructuredPanelCard = styledComponents(PanelCard)`
  grid-area: structured;
`;

export const NaturalPanelCard = styledComponents(PanelCard)`
  grid-area: natural;
`;

export const SuggestionsPanel = styledComponents(OakBox)`
  grid-area: suggestions;
`;

export const FacetsPanel = styledComponents(OakBox)`
  grid-area: facets;
`;

export const AccentTypography = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
`;

export const PrimarySubmitButton = styledComponents.button`
  align-items: center;
  background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  border: 2px solid ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
  cursor: pointer;
  display: inline-flex;
  font-family: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.fontFamily};
  font-size: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.fontSizeRem};
  font-weight: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.fontWeight};
  gap: var(--app-gap-cluster);
  justify-content: center;
  line-height: ${({ theme }) => getAppTheme(theme).app.typography.bodyStrong.lineHeight};
  padding-block: calc(var(--app-gap-cluster) / 1.5);
  padding-inline: var(--app-gap-section);
  text-decoration: none;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, color 0.15s ease-in-out;

  &:hover,
  &:active {
    background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDark};
    border-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDark};
    border-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDark};
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
    outline-offset: 2px;
  }
`;
