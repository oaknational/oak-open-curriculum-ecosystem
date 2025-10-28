import { useCallback, useState, useTransition, type Dispatch, type SetStateAction } from 'react';
import type {
  SearchStructuredRequest,
  SearchSuggestionItem,
} from '@oaknational/oak-curriculum-sdk';
import type { StructuredSearchAction } from '../structured/StructuredSearch';
import type { SearchController } from './useSearchController';
import type { SequenceFacet } from '../../../../src/lib/hybrid-search/types';
import { buildFacetFollowUpInput } from '../utils/facet-search';
import { buildSuggestionFollowUpInput } from '../utils/suggestion-search';

export interface StructuredFollowUpHandlers {
  recordPayload: (payload: SearchStructuredRequest) => void;
  handleScopeChange: (scope: SearchStructuredRequest['scope']) => void;
  handleFacetSelect: (facet: SequenceFacet) => void;
  handleSuggestionSelect: (suggestion: SearchSuggestionItem) => void;
}

export interface UseStructuredFollowUpArgs {
  searchStructured: StructuredSearchAction;
  controller: SearchController;
}

export function useStructuredFollowUp({
  searchStructured,
  controller,
}: UseStructuredFollowUpArgs): StructuredFollowUpHandlers {
  const [lastStructured, setLastStructured] = useState<SearchStructuredRequest | null>(null);
  const runSearch = useStructuredSearchRunner(searchStructured, controller);

  const recordPayload = useCallback((payload: SearchStructuredRequest) => {
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
    (payload: SearchStructuredRequest) => {
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
  lastStructured: SearchStructuredRequest | null;
  setLastStructured: Dispatch<SetStateAction<SearchStructuredRequest | null>>;
  runSearch: (payload: SearchStructuredRequest) => void;
}) {
  return useCallback(
    (scope: SearchStructuredRequest['scope']) => {
      if (!lastStructured) {
        return;
      }
      const payload: SearchStructuredRequest = {
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
  lastStructured: SearchStructuredRequest | null;
  setLastStructured: Dispatch<SetStateAction<SearchStructuredRequest | null>>;
  runSearch: (payload: SearchStructuredRequest) => void;
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
  lastStructured: SearchStructuredRequest | null;
  setLastStructured: Dispatch<SetStateAction<SearchStructuredRequest | null>>;
  runSearch: (payload: SearchStructuredRequest) => void;
}) {
  return useCallback(
    (suggestion: SearchSuggestionItem) => {
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
