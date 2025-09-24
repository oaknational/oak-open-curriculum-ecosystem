'use client';

import { useCallback, useMemo, useReducer } from 'react';
import { z } from 'zod';
import { HybridResponseSchema, SuggestionItemSchema } from '../structured-search.shared';
import type { HybridResponse, SuggestionItem } from '../structured-search.shared';
import { SearchFacetsSchema } from '../../../src/types/oak';
import type { SearchFacets } from '../../../src/types/oak';

type HybridAggregations = NonNullable<HybridResponse['aggregations']>;

export interface SearchMeta {
  scope: HybridResponse['scope'];
  total: number;
  took: number;
  timedOut: boolean;
  aggregations?: HybridAggregations;
}

export type SearchController = {
  results: unknown[];
  facets: SearchFacets | null;
  meta: SearchMeta | null;
  suggestions: SuggestionItem[];
  error: string | null;
  loading: boolean;
  onStart: () => void;
  onSuccess: (payload: unknown | null) => void;
  onError: (message: string) => void;
};

const StructuredPayloadSchema = HybridResponseSchema.extend({
  suggestions: z.array(SuggestionItemSchema).optional(),
});

interface ParsedHybridPayload {
  results: unknown[];
  facets: SearchFacets | null;
  meta: SearchMeta | null;
  suggestions: SuggestionItem[];
}

type SearchState = {
  results: unknown[];
  facets: SearchFacets | null;
  meta: SearchMeta | null;
  suggestions: SuggestionItem[];
  error: string | null;
  loading: boolean;
};

type SearchAction =
  | { type: 'start' }
  | { type: 'success'; payload: ParsedHybridPayload }
  | { type: 'array'; results: unknown[] }
  | { type: 'reset' }
  | { type: 'error'; message: string };

const INITIAL_SEARCH_STATE: SearchState = {
  results: [],
  facets: null,
  meta: null,
  suggestions: [],
  error: null,
  loading: false,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'start':
      return { ...INITIAL_SEARCH_STATE, loading: true };
    case 'success':
      return {
        ...state,
        results: action.payload.results,
        facets: action.payload.facets,
        meta: action.payload.meta,
        suggestions: action.payload.suggestions,
        error: null,
        loading: false,
      };
    case 'array':
      return { ...INITIAL_SEARCH_STATE, results: action.results };
    case 'reset':
      return { ...INITIAL_SEARCH_STATE };
    case 'error':
      return { ...state, error: action.message, loading: false };
    default:
      return state;
  }
}

export function useSearchController(): SearchController {
  const [state, dispatch] = useReducer(searchReducer, INITIAL_SEARCH_STATE);

  const onStart = useCallback(() => {
    dispatch({ type: 'start' });
  }, []);

  const onSuccess = useCallback((payload: unknown | null) => {
    const parsed = parseHybridPayload(payload);
    if (parsed) {
      dispatch({ type: 'success', payload: parsed });
      return;
    }

    if (Array.isArray(payload)) {
      dispatch({ type: 'array', results: payload });
      return;
    }

    dispatch({ type: 'reset' });
  }, []);

  const onError = useCallback((message: string) => {
    dispatch({ type: 'error', message });
  }, []);

  return useMemo(
    () => ({ ...state, onStart, onSuccess, onError }),
    [state, onStart, onSuccess, onError],
  );
}

function parseHybridPayload(payload: unknown | null): ParsedHybridPayload | null {
  if (!payload) {
    return null;
  }
  const parsed = StructuredPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return null;
  }
  const data = parsed.data;
  const facetsResult = data.facets ? SearchFacetsSchema.safeParse(data.facets) : null;
  return {
    results: data.results,
    facets: facetsResult && facetsResult.success ? facetsResult.data : null,
    meta: {
      scope: data.scope,
      total: data.total,
      took: data.took,
      timedOut: data.timedOut,
      aggregations: data.aggregations ?? undefined,
    },
    suggestions: data.suggestions ?? [],
  };
}
