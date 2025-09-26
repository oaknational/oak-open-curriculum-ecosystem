import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { getAppTheme } from '../themes/app-theme-helpers';
import { resolveBreakpoint } from '../shared/breakpoints';

export const PageContainer = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
  width: 100%;
  max-inline-size: var(--app-layout-container-max-width);
  margin-inline: auto;
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

export const ControlsGrid = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'structured'
    'natural';

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
        grid-auto-flow: column;
        grid-auto-columns: minmax(var(--app-layout-secondary-column-min-width), 1fr);
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
  border-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  max-inline-size: 45ch;
`;

const PanelCard = styledComponents(OakBox)`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-cluster);
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
  border-color: ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
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
  border: 1px solid ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
  color: #fff;
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
