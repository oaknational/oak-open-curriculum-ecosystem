import type { JSX } from 'react';
import { OakTypography } from '@oaknational/oak-components';
import SearchResultsComponent from '../SearchResults';
import type { StructuredSearchAction } from '../StructuredSearch';
import type { StructuredFollowUpHandlers } from './useStructuredFollowUp';
import type { SearchController } from './useSearchController';
import type { FixtureMode } from '../../lib/fixture-mode';
import { ContentContainer, HeroControlsCluster, PageContainer } from './SearchPageClient.styles';
import { SearchFixtureNotice } from './SearchFixtureNotice';
import {
  SearchForms,
  SearchHero,
  SearchSecondary,
  SearchSkipLinks,
  resolveControlLayout,
  type SearchLayoutVariant,
} from './SearchPageLayout.sections';

export type { SearchLayoutVariant } from './SearchPageLayout.sections';

interface SearchPageLayoutProps {
  readonly controller: SearchController;
  readonly followUp: StructuredFollowUpHandlers;
  readonly searchAction: StructuredSearchAction;
  readonly initialFixtureMode: FixtureMode;
  readonly showFixtureToggle: boolean;
  readonly variant?: SearchLayoutVariant;
}

export function SearchPageLayout(props: SearchPageLayoutProps): JSX.Element {
  const {
    controller,
    followUp,
    searchAction,
    initialFixtureMode,
    showFixtureToggle,
    variant = 'default',
  } = props;
  return (
    <PageContainer
      data-testid="search-page"
      as="main"
      $background="bg-primary"
      $color="text-primary"
    >
      <ContentContainer data-testid="search-page-content">
        <SearchPageLayoutBody
          controller={controller}
          followUp={followUp}
          searchAction={searchAction}
          initialFixtureMode={initialFixtureMode}
          showFixtureToggle={showFixtureToggle}
          variant={variant}
        />
      </ContentContainer>
    </PageContainer>
  );
}

function SearchPageLayoutBody({
  controller,
  followUp,
  searchAction,
  initialFixtureMode,
  showFixtureToggle,
  variant,
}: Required<SearchPageLayoutProps>): JSX.Element {
  return (
    <>
      <SearchFixtureNotice initialFixtureMode={initialFixtureMode} visible={showFixtureToggle} />

      <SearchSkipLinks variant={variant} />

      <SearchHeroAndForms
        controller={controller}
        followUp={followUp}
        searchAction={searchAction}
        variant={variant}
      />

      <SearchSecondary
        suggestions={controller.suggestions}
        onSelectSuggestion={followUp.handleSuggestionSelect}
        facets={controller.facets}
        onSelectSequence={followUp.handleFacetSelect}
      />

      <SearchErrorMessage error={controller.error} />

      <SearchResultsComponent
        mode={controller.mode}
        results={controller.results}
        meta={controller.meta}
        multiBuckets={controller.multiBuckets}
      />
    </>
  );
}

function SearchHeroAndForms({
  controller,
  followUp,
  searchAction,
  variant,
}: {
  controller: SearchController;
  followUp: StructuredFollowUpHandlers;
  searchAction: StructuredSearchAction;
  variant: SearchLayoutVariant;
}): JSX.Element {
  const layout = resolveControlLayout(variant);
  const controlsFirst = variant !== 'default';

  return (
    <HeroControlsCluster
      as="section"
      aria-label="Search hero and controls"
      $controlsFirst={controlsFirst}
    >
      <SearchHero variant={variant} />
      <SearchForms
        searchAction={searchAction}
        controller={controller}
        followUp={followUp}
        variant={variant}
        layout={layout}
      />
    </HeroControlsCluster>
  );
}

function SearchErrorMessage({ error }: { error: string | null }): JSX.Element | null {
  if (!error) {
    return null;
  }
  return (
    <OakTypography as="p" role="alert" $font="body-3" $color="text-error">
      {error}
    </OakTypography>
  );
}
