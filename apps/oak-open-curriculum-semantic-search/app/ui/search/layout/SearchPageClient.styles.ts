/* eslint max-lines: ["error", 350] -- Allow longer style file */

import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents, { css } from 'styled-components';
import { PageContainer, PageContent } from '../../global/Layout';
import { getAppTheme } from '../../themes/app-theme-helpers';
import { resolveUiColor } from '../../../lib/theme/ThemeGlobalStyle';
import { resolveBreakpoint } from '../../shared/breakpoints';
import type { SearchLayoutVariant } from './SearchPageLayout.types';
import {
  controlsGridBase,
  controlsGridMd,
  controlsGridXl,
  type ControlsLayout,
} from './SearchPageControlsGrid';

export type { ControlsLayout } from './SearchPageControlsGrid';

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export { PageContainer };

export const ContentContainer = styledComponents(PageContent)`
  width: min(100%, var(--app-layout-container-max-width));
  max-inline-size: min(100%, var(--app-layout-container-max-width));
  max-width: min(100%, var(--app-layout-container-max-width));
  margin-inline: auto;
`;

export const PrimaryGrid = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'hero'
    'results'
    'support';

  ${({ theme }) => {
    const lg = resolveBreakpoint(theme, 'lg');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${lg}) {
        grid-template-columns:
          minmax(0, 1.1fr)
          minmax(0, 0.9fr);
        grid-template-areas:
          'results hero'
          'results support';
        align-items: start;
      }

      @media (min-width: ${xl}) {
        grid-template-columns:
          minmax(0, 1.2fr)
          minmax(0, 0.8fr);
      }
    `;
  }}
`;

export const HeroControlsCluster = styledComponents(OakBox)<{
  $controlsFirst?: boolean;
  $variant: SearchLayoutVariant;
}>`
  display: grid;
  gap: var(--app-gap-section);
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas: ${({ $controlsFirst }) =>
    $controlsFirst ? "'controls' 'hero'" : "'hero' 'controls'"};
  grid-area: hero;

  ${({ theme, $controlsFirst, $variant }) => {
    if ($variant === 'natural') {
      return '';
    }
    const xl = resolveBreakpoint(theme, 'xl');
    const xxl = resolveBreakpoint(theme, 'xxl');
    const rowTemplate = $controlsFirst ? "'controls hero'" : "'hero controls'";
    return css`
      @media (min-width: ${xl}) {
        grid-template-columns:
          minmax(0, 0.9fr)
          minmax(0, 1.1fr);
        grid-template-areas: ${rowTemplate};
        align-items: start;
      }

      @media (min-width: ${xxl}) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-areas: ${rowTemplate};
      }
    `;
  }}
`;

export const ControlsGrid = styledComponents(OakBox)<{ $layout: ControlsLayout }>`
  display: grid;
  gap: var(--app-gap-section);
  grid-area: controls;
  align-items: stretch;
  ${({ $layout }) => controlsGridBase($layout)}

  ${({ theme, $layout }) => {
    const md = resolveBreakpoint(theme, 'md');
    const xl = resolveBreakpoint(theme, 'xl');
    return css`
      @media (min-width: ${md}) {
        ${controlsGridMd($layout)}
      }

      @media (min-width: ${xl}) {
        ${controlsGridXl($layout)}
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
  border-color: ${({ theme }) => getAppTheme(theme).app.colors.borderStrong};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  max-inline-size: min(45ch, 100%);
  width: 100%;
  min-inline-size: 0;
  grid-area: hero;

  &[data-variant='structured'] {
    border-color: ${({ theme }) =>
      resolveUiColor(getAppTheme(theme), 'border-decorative1-stronger')};
  }

  &[data-variant='natural'] {
    background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
    border-color: ${({ theme }) =>
      resolveUiColor(getAppTheme(theme), 'border-decorative2-stronger')};
  }
`;

export const HeroHeadingCluster = styledComponents(OakBox)`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  width: 100%;
  min-inline-size: 0;
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

export const ResultsColumn = styledComponents(OakBox)`
  grid-area: results;
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
`;

export const SupportColumn = styledComponents(OakBox)`
  grid-area: support;
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);
`;

export const MobileSupportStack = styledComponents(OakBox).attrs({
  'data-testid': 'search-support-mobile',
})`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap-section);

  ${({ theme }) => {
    const lg = resolveBreakpoint(theme, 'lg');
    return css`
      @media (min-width: ${lg}) {
        display: none;
      }
    `;
  }}
`;

export const MobileAccordionSection = styledComponents(OakBox)`
  border: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  background: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  overflow: hidden;
`;

export const MobileAccordionButton = styledComponents.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  background: transparent;
  border: none;
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};
  font-family: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-brand')};
    outline-offset: 2px;
  }
`;

export const MobileAccordionContent = styledComponents(OakBox)`
  display: grid;
  gap: var(--app-gap-section);
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
  border-top: 1px solid ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
`;

export const AccentTypography = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  text-shadow: 0 0 1rem
    ${({ theme }) => hexToRgba(getAppTheme(theme).app.palette.brandPrimaryBright, 0.5)};
`;

export const SkipLinksNav = styledComponents.nav`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: var(--app-gap-inline, var(--app-gap-cluster));
`;

export const SkipLink = styledComponents(OakTypography).attrs({ as: 'a', $font: 'body-4-bold' })`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  border: 0;
  padding: 0;
  margin: 0;
  text-decoration: none;
  color: ${({ theme }) => getAppTheme(theme).app.colors.textPrimary};

  &:focus-visible {
    position: static;
    left: auto;
    top: auto;
    width: auto;
    height: auto;
    clip: auto;
    padding: 0.5rem 1rem;
    border-radius: ${({ theme }) => getAppTheme(theme).app.radii.pill};
    border: 2px solid
      ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-brand')};
    background: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
    color: ${({ theme }) => resolveUiColor(getAppTheme(theme), 'text-inverted')};
    box-shadow: 0 0 0 4px
      ${({ theme }) => resolveUiColor(getAppTheme(theme), 'border-neutral-lighter')};
    z-index: 10;
  }
`;
