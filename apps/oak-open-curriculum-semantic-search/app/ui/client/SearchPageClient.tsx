'use client';

import {
  useCallback,
  useState,
  useTransition,
  type Dispatch,
  type SetStateAction,
  type JSX,
} from 'react';
import sc from 'styled-components';
import { useSearchController, type SearchController } from './useSearchController';
import { StructuredSearch } from '../StructuredSearch';
import type { StructuredSearchAction } from '../StructuredSearch';
import NaturalSearchComponent from '../NaturalSearch';
import SearchResultsComponent from '../SearchResults';
import { SearchFacets } from '../SearchFacets';
import type { StructuredBody } from '../structured-search.shared';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import { buildFacetFollowUpInput } from './facet-search';

const Main = sc.main`
  max-width: ${(p) => p.theme.app.layout.containerMaxWidth};
  margin: 0 auto;
  padding: ${(p) => p.theme.app.space.lg};
`;

const Section = sc.section`
  margin-bottom: ${(p) => p.theme.app.space.lg};
`;

const ErrorMessage = sc.p`
  color: ${(p) => p.theme.app.colors.errorText};
  margin-top: ${(p) => p.theme.app.space.lg};
`;

const Title = sc.h1`
  margin-bottom: ${(p) => p.theme.app.space.sm};
`;

const Lead = sc.p`
  margin-top: 0;
`;

export default function SearchPageClient({
  searchStructured,
}: {
  searchStructured: StructuredSearchAction;
}): JSX.Element {
  const ctrl = useSearchController();
  const followUp = useStructuredFollowUp({ searchStructured, controller: ctrl });

  return (
    <Main>
      <Title>Hybrid Search</Title>
      <Lead>Structured and natural language side by side.</Lead>

      <StructuredPanel searchAction={searchStructured} controller={ctrl} followUp={followUp} />

      <SearchFacets facets={ctrl.facets} onSelectSequence={followUp.handleFacetSelect} />

      <NaturalPanel controller={ctrl} />

      {ctrl.error ? <ErrorMessage role="alert">{ctrl.error}</ErrorMessage> : null}

      <SearchResultsComponent results={ctrl.results} meta={ctrl.meta} />
    </Main>
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
    <Section aria-labelledby="structured-heading">
      <h2 id="structured-heading">Structured</h2>
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
    </Section>
  );
}

function NaturalPanel({ controller }: { controller: SearchController }): JSX.Element {
  return (
    <Section aria-labelledby="nl-heading">
      <h2 id="nl-heading">Natural language</h2>
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
    </Section>
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
