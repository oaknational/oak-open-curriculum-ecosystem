'use client';

import { useCallback, useMemo, useReducer } from 'react';
import {
  SearchFacetsSchema,
  SearchLessonsResponseSchema,
  SearchMultiScopeResponseSchema,
  SearchSequencesResponseSchema,
  SearchUnitsResponseSchema,
  type SearchFacets,
  type SearchLessonsResponse,
  type SearchMultiScopeBucket,
  type SearchMultiScopeResponse,
  type SearchScope,
  type SearchSequencesResponse,
  type SearchSuggestionItem,
  type SearchUnitsResponse,
} from '@oaknational/oak-curriculum-sdk';

type HybridResponse = SearchLessonsResponse | SearchUnitsResponse | SearchSequencesResponse;

const HybridResponseSchema = SearchLessonsResponseSchema.or(SearchUnitsResponseSchema).or(
  SearchSequencesResponseSchema,
);

type HybridAggregations = HybridResponse['aggregations'];

export interface SearchMeta {
  scope: SearchScope;
  total: number;
  took: number;
  timedOut: boolean;
  aggregations?: HybridAggregations;
}

export interface MultiScopeBucketView {
  scope: SearchScope;
  meta: SearchMeta;
  results: unknown[];
  facets: SearchFacets | null;
}

export type SearchController = {
  mode: 'idle' | 'single' | 'multi';
  results: unknown[];
  facets: SearchFacets | null;
  meta: SearchMeta | null;
  multiBuckets: MultiScopeBucketView[] | null;
  suggestions: SearchSuggestionItem[];
  error: string | null;
  loading: boolean;
  onStart: () => void;
  onSuccess: (payload: unknown | null) => void;
  onError: (message: string | null) => void;
};

type ParsedHybridPayload =
  | { kind: 'single'; response: HybridResponse }
  | { kind: 'multi'; response: SearchMultiScopeResponse };

type SearchState = {
  mode: 'idle' | 'single' | 'multi';
  results: unknown[];
  facets: SearchFacets | null;
  meta: SearchMeta | null;
  multiBuckets: MultiScopeBucketView[] | null;
  suggestions: SearchSuggestionItem[];
  error: string | null;
  loading: boolean;
};

type SearchAction =
  | { type: 'start' }
  | { type: 'success'; payload: ParsedHybridPayload }
  | { type: 'array'; results: unknown[] }
  | { type: 'reset' }
  | { type: 'error'; message: string | null };

const INITIAL_SEARCH_STATE: SearchState = {
  mode: 'idle',
  results: [],
  facets: null,
  meta: null,
  multiBuckets: null,
  suggestions: [],
  error: null,
  loading: false,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'start':
      return { ...INITIAL_SEARCH_STATE, loading: true };
    case 'success':
      return action.payload.kind === 'single'
        ? applySingleSuccess(state, action.payload.response)
        : applyMultiSuccess(state, action.payload.response);
    case 'array':
      return { ...INITIAL_SEARCH_STATE, mode: 'single', results: action.results };
    case 'reset':
      return { ...INITIAL_SEARCH_STATE };
    case 'error':
      return { ...state, error: action.message ?? null, loading: false };
    default:
      return state;
  }
}

function applySingleSuccess(state: SearchState, response: HybridResponse): SearchState {
  const facetsResult = response.facets ? SearchFacetsSchema.safeParse(response.facets) : null;
  return {
    ...state,
    mode: 'single',
    results: response.results,
    facets: facetsResult && facetsResult.success ? facetsResult.data : null,
    meta: toSearchMeta(response),
    multiBuckets: null,
    suggestions: response.suggestions ?? [],
    error: null,
    loading: false,
  };
}

function applyMultiSuccess(state: SearchState, response: SearchMultiScopeResponse): SearchState {
  return {
    ...state,
    mode: 'multi',
    results: [],
    facets: null,
    meta: null,
    multiBuckets: response.buckets.map(toBucketView),
    suggestions: response.suggestions ?? [],
    error: null,
    loading: false,
  };
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

  const onError = useCallback((message: string | null) => {
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
  const parsed = HybridResponseSchema.safeParse(payload);
  if (!parsed.success) {
    const multi = SearchMultiScopeResponseSchema.safeParse(payload);
    if (multi.success) {
      return { kind: 'multi', response: multi.data };
    }
    return null;
  }
  return { kind: 'single', response: parsed.data };
}

function toSearchMeta(response: HybridResponse): SearchMeta {
  return {
    scope: response.scope,
    total: response.total,
    took: response.took,
    timedOut: response.timedOut,
    aggregations: response.aggregations ?? undefined,
  };
}

function toBucketView(bucket: SearchMultiScopeBucket): MultiScopeBucketView {
  const facetsResult = bucket.result.facets
    ? SearchFacetsSchema.safeParse(bucket.result.facets)
    : null;
  return {
    scope: bucket.scope,
    meta: toSearchMeta(bucket.result),
    results: bucket.result.results,
    facets: facetsResult && facetsResult.success ? facetsResult.data : null,
  };
}
