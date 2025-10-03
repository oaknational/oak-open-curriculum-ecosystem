import { useCallback, useState, useTransition, type Dispatch, type SetStateAction } from 'react';
import type { StructuredBody, SuggestionItem } from '../structured-search.shared';
import type { StructuredSearchAction } from '../StructuredSearch';
import type { SearchController } from './useSearchController';
import type { SequenceFacet } from '../../../src/lib/hybrid-search/types';
import { buildFacetFollowUpInput } from './facet-search';
import { buildSuggestionFollowUpInput } from './suggestion-search';

export interface StructuredFollowUpHandlers {
  recordPayload: (payload: StructuredBody) => void;
  handleScopeChange: (scope: StructuredBody['scope']) => void;
  handleFacetSelect: (facet: SequenceFacet) => void;
  handleSuggestionSelect: (suggestion: SuggestionItem) => void;
}

export interface UseStructuredFollowUpArgs {
  searchStructured: StructuredSearchAction;
  controller: SearchController;
}

export function useStructuredFollowUp({
  searchStructured,
  controller,
}: UseStructuredFollowUpArgs): StructuredFollowUpHandlers {
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

  const handleSuggestionSelect = useSuggestionSelectHandler({
    controller,
    lastStructured,
    setLastStructured,
    runSearch,
  });

  return { recordPayload, handleScopeChange, handleFacetSelect, handleSuggestionSelect };
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
            const fallback =
              error instanceof Error && error.message.length > 0
                ? error.message
                : 'Search failed. Try again later.';
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

function useSuggestionSelectHandler({
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
    (suggestion: SuggestionItem) => {
      const next = buildSuggestionFollowUpInput({ base: lastStructured, suggestion });
      if (!next) {
        controller.onError('Run a structured search before selecting a suggestion.');
        return;
      }
      setLastStructured(next);
      runSearch(next);
    },
    [controller, lastStructured, runSearch, setLastStructured],
  );
}
