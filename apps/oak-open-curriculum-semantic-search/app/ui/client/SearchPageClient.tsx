'use client';

import type { JSX } from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import { useSearchController, type SearchController } from './useSearchController';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';
import { SearchFacets } from '../SearchFacets';
import { SearchSuggestions } from '../SearchSuggestions';
import { useStructuredFollowUp } from './useStructuredFollowUp';
import {
  AccentTypography,
  ControlsGrid,
  FacetsPanel,
  HeroCard,
  ContentContainer,
  HeroControlsCluster,
  NaturalPanelCard,
  PageContainer,
  SecondaryGrid,
  StructuredPanelCard,
  SuggestionsPanel,
} from './SearchPageClient.styles';

const HERO_BODY_PARAGRAPHS: ReadonlyArray<string> = [
  'We expose two search experiences: a structured search experience and a natural language search experience. Both combine traditional lexical search with semantic search to deliver more relevant results.',
  'The structured search allows filtering on many dimensions, such as subject, year, and topic.',
  'The natural language search takes queries like "find me lessons about history that can be adapted for Leeds", passes that to an LLM to figure out the intent, and then defers to the structured search to find the best results with hybrid lexical and semantic search.',
];

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
      $background="bg-primary"
      $color="text-primary"
    >
      <ContentContainer data-testid="search-page-content">
        <HeroControlsCluster as="section" aria-label="Search hero and controls">
          <SearchHero />
          <SearchForms searchAction={searchStructured} controller={ctrl} followUp={followUp} />
        </HeroControlsCluster>

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

        <SearchResultsComponent
          mode={ctrl.mode}
          results={ctrl.results}
          meta={ctrl.meta}
          multiBuckets={ctrl.multiBuckets}
        />
      </ContentContainer>
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
    <ControlsGrid as="section" aria-label="Search controls">
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
      <SuggestionsPanel>
        <SearchSuggestions suggestions={suggestions} onSelectSuggestion={onSelectSuggestion} />
      </SuggestionsPanel>
      <FacetsPanel>
        <SearchFacets facets={facets} onSelectSequence={onSelectSequence} />
      </FacetsPanel>
    </SecondaryGrid>
  );
}

function SearchHero(): JSX.Element {
  return (
    <HeroCard data-testid="search-hero" $ba="border-solid-s">
      <OakTypography as="h1" $font="heading-3">
        <OakBox as="span" $display="inline-flex" $gap="space-between-ssx">
          <AccentTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Hybrid
          </AccentTypography>
          <OakTypography as="span" $font="heading-3">
            Search <em>Alpha</em>
          </OakTypography>
        </OakBox>
      </OakTypography>
      <OakTypography as="p" $font="body-4" $color="text-subdued">
        Search lessons, units, and sequences.
      </OakTypography>
      {HERO_BODY_PARAGRAPHS.map((paragraph) => (
        <OakTypography as="p" $font="body-2" key={paragraph}>
          {paragraph}
        </OakTypography>
      ))}
      <OakTypography as="p" $font="body-2">
        Ready to start?{' '}
        <OakTypography as="a" href="#structured-search-panel" $font="body-2-bold">
          Jump to structured search
        </OakTypography>{' '}
        or{' '}
        <OakTypography as="a" href="#natural-search-panel" $font="body-2-bold">
          try the natural language search
        </OakTypography>
        .
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
    <StructuredPanelCard
      as="section"
      aria-labelledby="structured-heading"
      data-testid="structured-search-panel"
      id="structured-search-panel"
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
    </StructuredPanelCard>
  );
}

function NaturalPanel({ controller }: { controller: SearchController }): JSX.Element {
  return (
    <NaturalPanelCard
      as="section"
      aria-labelledby="nl-heading"
      data-testid="natural-search-panel"
      id="natural-search-panel"
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
    </NaturalPanelCard>
  );
}
