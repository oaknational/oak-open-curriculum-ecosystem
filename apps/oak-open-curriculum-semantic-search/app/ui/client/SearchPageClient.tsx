'use client';

import {
  useCallback,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
  type JSX,
} from 'react';
import { OakBox, OakTypography } from '@oaknational/oak-components';
import { useSearchController, type SearchController } from './useSearchController';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';
import { SearchFacets } from '../SearchFacets';
import { SearchSuggestions } from '../SearchSuggestions';
import type { StructuredBody } from '../structured-search.shared';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import { buildFacetFollowUpInput } from './facet-search';

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

      <SearchSuggestions suggestions={ctrl.suggestions} />

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

function useStructuredFollowUp({
  searchStructured,
  controller,
}: {
  searchStructured: StructuredSearchAction;
  controller: SearchController;
}) {
  const [lastStructured, setLastStructured] = useState<StructuredBody | null>(null);
  const runSearch = useStructuredSearchRunner(searchStructured, controller);

  const recordPayload = useCallback((payload: StructuredBody) => {
    setLastStructured(payload);
  }, []);

  const handleScopeChange = useScopeChangeHandler({
    lastStructured,
    setLastStructured,
    runSearch,
  });

  const handleFacetSelect = useFacetSelectHandler({
    controller,
    lastStructured,
    setLastStructured,
    runSearch,
  });

  return { recordPayload, handleScopeChange, handleFacetSelect };
}

function useStructuredSearchRunner(
  searchStructured: StructuredSearchAction,
  controller: SearchController,
) {
  const [, startTransition] = useTransition();

  return useCallback(
    (payload: StructuredBody) => {
      startTransition(() => {
        void (async () => {
          controller.onStart();
          try {
            const { result, error } = await searchStructured(payload);
            if (error) {
              controller.onError(error);
              return;
            }
            controller.onSuccess(result ?? null);
          } catch (error) {
            const fallback = error instanceof Error ? error.message : 'Search failed';
            controller.onError(fallback);
          }
        })();
      });
    },
    [controller, searchStructured, startTransition],
  );
}

function useScopeChangeHandler({
  lastStructured,
  setLastStructured,
  runSearch,
}: {
  lastStructured: StructuredBody | null;
  setLastStructured: Dispatch<SetStateAction<StructuredBody | null>>;
  runSearch: (payload: StructuredBody) => void;
}) {
  return useCallback(
    (scope: StructuredBody['scope']) => {
      if (!lastStructured) {
        return;
      }
      const payload: StructuredBody = {
        ...lastStructured,
        scope,
        phaseSlug: scope === 'sequences' ? lastStructured.phaseSlug : undefined,
      };
      setLastStructured(payload);
      runSearch(payload);
    },
    [lastStructured, runSearch, setLastStructured],
  );
}

function useFacetSelectHandler({
  controller,
  lastStructured,
  setLastStructured,
  runSearch,
}: {
  controller: SearchController;
  lastStructured: StructuredBody | null;
  setLastStructured: Dispatch<SetStateAction<StructuredBody | null>>;
  runSearch: (payload: StructuredBody) => void;
}) {
  return useCallback(
    (facet: SequenceFacet) => {
      const next = buildFacetFollowUpInput({ base: lastStructured, facet });
      if (!next) {
        controller.onError('Run a structured search before selecting a programme.');
        return;
      }
      setLastStructured(next);
      runSearch(next);
    },
    [controller, lastStructured, runSearch, setLastStructured],
  );
}
