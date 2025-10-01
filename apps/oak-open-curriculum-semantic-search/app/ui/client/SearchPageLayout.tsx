import type { ComponentProps, JSX } from 'react';
import { OakTypography } from '@oaknational/oak-components';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';
import { SearchFacets } from '../SearchFacets';
import { SearchSuggestions } from '../SearchSuggestions';
import type { StructuredFollowUpHandlers } from './useStructuredFollowUp';
import type { SearchController } from './useSearchController';
import type { FixtureMode } from '../../lib/fixture-mode';
import {
  AccentTypography,
  ControlsGrid,
  FacetsPanel,
  HeroCard,
  HeroHeadingCluster,
  ContentContainer,
  HeroControlsCluster,
  NaturalPanelCard,
  PageContainer,
  SecondaryGrid,
  StructuredPanelCard,
  SuggestionsPanel,
} from './SearchPageClient.styles';
import { SearchFixtureNotice } from './SearchFixtureNotice';

interface SearchPageLayoutProps {
  readonly controller: SearchController;
  readonly followUp: StructuredFollowUpHandlers;
  readonly searchAction: StructuredSearchAction;
  readonly initialFixtureMode: FixtureMode;
  readonly showFixtureToggle: boolean;
}

export function SearchPageLayout({
  controller,
  followUp,
  searchAction,
  initialFixtureMode,
  showFixtureToggle,
}: SearchPageLayoutProps): JSX.Element {
  return (
    <PageContainer
      data-testid="search-page"
      as="main"
      $background="bg-primary"
      $color="text-primary"
    >
      <ContentContainer data-testid="search-page-content">
        <SearchFixtureNotice initialFixtureMode={initialFixtureMode} visible={showFixtureToggle} />

        <HeroControlsCluster as="section" aria-label="Search hero and controls">
          <SearchHero />
          <SearchForms searchAction={searchAction} controller={controller} followUp={followUp} />
        </HeroControlsCluster>

        <SearchSecondary
          suggestions={controller.suggestions}
          onSelectSuggestion={followUp.handleSuggestionSelect}
          facets={controller.facets}
          onSelectSequence={followUp.handleFacetSelect}
        />

        {controller.error ? (
          <OakTypography as="p" role="alert" $font="body-3" $color="text-error">
            {controller.error}
          </OakTypography>
        ) : null}

        <SearchResultsComponent
          mode={controller.mode}
          results={controller.results}
          meta={controller.meta}
          multiBuckets={controller.multiBuckets}
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
  followUp: StructuredFollowUpHandlers;
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
  suggestions: ComponentProps<typeof SearchSuggestions>['suggestions'];
  onSelectSuggestion: ComponentProps<typeof SearchSuggestions>['onSelectSuggestion'];
  facets: ComponentProps<typeof SearchFacets>['facets'];
  onSelectSequence: ComponentProps<typeof SearchFacets>['onSelectSequence'];
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
        <HeroHeadingCluster as="span">
          <AccentTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Hybrid
          </AccentTypography>
          <OakTypography as="span" $font="heading-3" $pr="space-between-ssx">
            Search
          </OakTypography>
          <OakTypography as="span" $font="heading-3">
            <em>Alpha</em>
          </OakTypography>
        </HeroHeadingCluster>
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
  followUp: StructuredFollowUpHandlers;
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

const HERO_BODY_PARAGRAPHS: ReadonlyArray<string> = [
  'We expose two search experiences: a structured search experience and a natural language search experience. Both combine traditional lexical search with semantic search to deliver more relevant results.',
  'The structured search allows filtering on many dimensions, such as subject, year, and topic.',
  'The natural language search takes queries like "find me lessons about history that can be adapted for Leeds", passes that to an LLM to figure out the intent, and then defers to the structured search to find the best results with hybrid lexical and semantic search.',
];
