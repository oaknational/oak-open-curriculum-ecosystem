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

export default function SearchPageClient({
  searchStructured,
}: {
  searchStructured: StructuredSearchAction;
}): JSX.Element {
  const ctrl = useSearchController();
  const followUp = useStructuredFollowUp({ searchStructured, controller: ctrl });

  return (
    <OakBox
      as="main"
      $maxWidth="900px"
      $ma="auto"
      $pa="inner-padding-xl"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-xl"
    >
      <OakBox $display="flex" $flexDirection="column" $gap="space-between-xs">
        <OakTypography as="h1" $font="heading-4">
          Hybrid Search
        </OakTypography>
        <OakTypography as="p" $font="body-3">
          Structured and natural language side by side.
        </OakTypography>
      </OakBox>

      <StructuredPanel searchAction={searchStructured} controller={ctrl} followUp={followUp} />

      <SearchSuggestions
        suggestions={ctrl.suggestions}
        onSelectSuggestion={followUp.handleSuggestionSelect}
      />

      <SearchFacets facets={ctrl.facets} onSelectSequence={followUp.handleFacetSelect} />

      <NaturalPanel controller={ctrl} />

      {ctrl.error ? (
        <OakTypography as="p" role="alert" $font="body-3" $color="text-error">
          {ctrl.error}
        </OakTypography>
      ) : null}

      <SearchResultsComponent results={ctrl.results} meta={ctrl.meta} />
    </OakBox>
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
    <OakBox
      as="section"
      aria-labelledby="structured-heading"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-sm"
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
    </OakBox>
  );
}

function NaturalPanel({ controller }: { controller: SearchController }): JSX.Element {
  return (
    <OakBox
      as="section"
      aria-labelledby="nl-heading"
      $display="flex"
      $flexDirection="column"
      $gap="space-between-sm"
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
    </OakBox>
  );
}
