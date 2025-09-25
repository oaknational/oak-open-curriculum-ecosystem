'use client';

import type { JSX } from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import styledComponents from 'styled-components';
import { useSearchController, type SearchController } from './useSearchController';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';
import { SearchFacets } from '../SearchFacets';
import { SearchSuggestions } from '../SearchSuggestions';
import { useStructuredFollowUp } from './useStructuredFollowUp';
import { getAppTheme } from '../themes/app-theme-helpers';

const PageContainer = styledComponents(OakBox)`
  row-gap: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
  padding-left: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
  padding-right: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
  padding-top: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  padding-bottom: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
`;

const ControlsGrid = styledComponents(OakBox)`
  display: grid;
  grid-template-columns: ${({ theme }) => {
    const appTheme = getAppTheme(theme);
    return `repeat(auto-fit, minmax(${appTheme.app.layout.controlColumnMinWidth}, 1fr))`;
  }};
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
`;

const SecondaryGrid = styledComponents(OakBox)`
  display: grid;
  grid-template-columns: ${({ theme }) => {
    const appTheme = getAppTheme(theme);
    return `repeat(auto-fit, minmax(${appTheme.app.layout.secondaryColumnMinWidth}, 1fr))`;
  }};
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.section};
`;

const HeroCard = styledComponents(OakBox)`
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceCard};
  border-color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryDeep};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
`;

const PanelCard = styledComponents(OakBox)`
  gap: ${({ theme }) => getAppTheme(theme).app.space.gap.cluster};
  background-color: ${({ theme }) => getAppTheme(theme).app.colors.surfaceRaised};
  border-color: ${({ theme }) => getAppTheme(theme).app.colors.borderSubtle};
  border-radius: ${({ theme }) => getAppTheme(theme).app.radii.card};
  padding: ${({ theme }) => getAppTheme(theme).app.space.padding.card};
`;

const AccentTypography = styledComponents(OakTypography)`
  color: ${({ theme }) => getAppTheme(theme).app.palette.brandPrimaryBright};
`;

export default function SearchPageClient({
  searchStructured,
}: {
  searchStructured: StructuredSearchAction;
}): JSX.Element {
  const ctrl = useSearchController();
  const followUp = useStructuredFollowUp({ searchStructured, controller: ctrl });

  return (
    <PageContainer
      data-testid="search-page"
      as="main"
      $maxWidth="var(--app-layout-container-max-width)"
      $width="100%"
      $ma="auto"
      $display="flex"
      $flexDirection="column"
      $background="bg-primary"
      $color="text-primary"
    >
      <SearchHero />

      <SearchForms searchAction={searchStructured} controller={ctrl} followUp={followUp} />

      <SearchSecondary
        suggestions={ctrl.suggestions}
        onSelectSuggestion={followUp.handleSuggestionSelect}
        facets={ctrl.facets}
        onSelectSequence={followUp.handleFacetSelect}
      />

      {ctrl.error ? (
        <OakTypography as="p" role="alert" $font="body-3" $color="text-error">
          {ctrl.error}
        </OakTypography>
      ) : null}

      <SearchResultsComponent results={ctrl.results} meta={ctrl.meta} />
    </PageContainer>
  );
}

function SearchForms({
  searchAction,
  controller,
  followUp,
}: {
  searchAction: StructuredSearchAction;
  controller: SearchController;
  followUp: ReturnType<typeof useStructuredFollowUp>;
}): JSX.Element {
  return (
    <ControlsGrid as="section" aria-label="Search controls" $display="grid">
      <StructuredPanel searchAction={searchAction} controller={controller} followUp={followUp} />
      <NaturalPanel controller={controller} />
    </ControlsGrid>
  );
}

function SearchSecondary({
  suggestions,
  onSelectSuggestion,
  facets,
  onSelectSequence,
}: {
  suggestions: React.ComponentProps<typeof SearchSuggestions>['suggestions'];
  onSelectSuggestion: React.ComponentProps<typeof SearchSuggestions>['onSelectSuggestion'];
  facets: React.ComponentProps<typeof SearchFacets>['facets'];
  onSelectSequence: React.ComponentProps<typeof SearchFacets>['onSelectSequence'];
}): JSX.Element {
  return (
    <SecondaryGrid>
      <SearchSuggestions suggestions={suggestions} onSelectSuggestion={onSelectSuggestion} />
      <SearchFacets facets={facets} onSelectSequence={onSelectSequence} />
    </SecondaryGrid>
  );
}

function SearchHero(): JSX.Element {
  return (
    <HeroCard
      data-testid="search-hero"
      $display="flex"
      $flexDirection="column"
      $ba="border-solid-s"
    >
      <OakTypography as="h1" $font="heading-3">
        <OakBox as="span" $display="inline-flex" $gap="space-between-ssx">
          <AccentTypography as="span" $font="heading-3">
            Hybrid
          </AccentTypography>
          <OakTypography as="span" $font="heading-3">
            Search
          </OakTypography>
        </OakBox>
      </OakTypography>
      <OakTypography as="p" $font="body-2">
        Structured and natural language together in one Oak-themed workspace to accelerate planning.
      </OakTypography>
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        Search units, lessons, and sequences without leaving the Oak ecosystem.
      </OakTypography>
    </HeroCard>
  );
}

function StructuredPanel({
  searchAction,
  controller,
  followUp,
}: {
  searchAction: StructuredSearchAction;
  controller: SearchController;
  followUp: ReturnType<typeof useStructuredFollowUp>;
}): JSX.Element {
  return (
    <PanelCard
      as="section"
      aria-labelledby="structured-heading"
      data-testid="structured-search-panel"
      $display="flex"
      $flexDirection="column"
      $ba="border-solid-s"
    >
      <OakTypography as="h2" id="structured-heading" $font="heading-6">
        Structured
      </OakTypography>
      <StructuredSearch
        action={searchAction}
        onResults={controller.onSuccess}
        onError={(message) => controller.onError(message ?? 'Unknown error')}
        setLoading={(isLoading) => {
          if (isLoading) {
            controller.onStart();
          }
        }}
        onScopeChange={followUp.handleScopeChange}
        onSubmitPayload={followUp.recordPayload}
      />
    </PanelCard>
  );
}

function NaturalPanel({ controller }: { controller: SearchController }): JSX.Element {
  return (
    <PanelCard
      as="section"
      aria-labelledby="nl-heading"
      data-testid="natural-search-panel"
      $display="flex"
      $flexDirection="column"
      $ba="border-solid-s"
    >
      <OakTypography as="h2" id="nl-heading" $font="heading-6">
        Natural language
      </OakTypography>
      <NaturalSearchComponent
        onResults={(payload) => controller.onSuccess(Array.isArray(payload) ? payload : [])}
        onError={(message) =>
          controller.onError(typeof message === 'string' ? message : 'Unknown error')
        }
        setLoading={(isLoading) => {
          if (isLoading) {
            controller.onStart();
          }
        }}
      />
    </PanelCard>
  );
}
