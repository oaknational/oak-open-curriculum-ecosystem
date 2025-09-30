import type { z } from 'zod';
import {
  DEFAULT_INCLUDE_FACETS,
  DEFAULT_SUGGESTION_CACHE as SDK_DEFAULT_SUGGESTION_CACHE,
  SearchStructuredRequestSchema,
  SearchSuggestionItemSchema,
  SearchSuggestionResponseSchema,
  SearchLessonsResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
  SearchMultiScopeResponseSchema,
} from '../../src/types/oak';
import type {
  SearchStructuredRequest,
  SearchScope,
  SearchScopeWithAll,
  SearchSuggestionItem,
  SearchSuggestionResponse,
  SearchMultiScopeBucket,
  SearchMultiScopeResponse,
  SearchLessonsResponse,
  SearchUnitsResponse,
  SearchSequencesResponse,
} from '../../src/types/oak';

export type StructuredBody = SearchStructuredRequest;
export const SearchRequest = SearchStructuredRequestSchema;
export const SuggestionItemSchema = SearchSuggestionItemSchema;
export const SuggestionResponseSchema = SearchSuggestionResponseSchema;
export const DEFAULT_SUGGESTION_CACHE = SDK_DEFAULT_SUGGESTION_CACHE;

const SuggestionCacheSchema = SearchSuggestionResponseSchema.shape.cache;

export const HybridResponseSchema = SearchLessonsResponseSchema.or(SearchUnitsResponseSchema).or(
  SearchSequencesResponseSchema,
);

export const MultiScopeBucketSchema = SearchMultiScopeResponseSchema.shape.buckets.element;
export const MultiScopeHybridResponseSchema = SearchMultiScopeResponseSchema;

export type HybridResponse = SearchLessonsResponse | SearchUnitsResponse | SearchSequencesResponse;
export type SuggestionItem = SearchSuggestionItem;
export type SuggestionResponse = SearchSuggestionResponse;
export type SuggestionCache = z.infer<typeof SuggestionCacheSchema>;
export type MultiScopeHybridResponse = SearchMultiScopeResponse;
export type MultiScopeBucket = SearchMultiScopeBucket;

export { DEFAULT_INCLUDE_FACETS };
export { SearchLessonsResponseSchema, SearchUnitsResponseSchema, SearchSequencesResponseSchema };
export type { SearchScope, SearchScopeWithAll };

export function buildBody(input: StructuredBody): StructuredBody {
  return {
    scope: input.scope,
    text: input.text,
    subject: input.subject ?? undefined,
    keyStage: input.keyStage ?? undefined,
    minLessons: input.minLessons,
    size: input.size,
    includeFacets: input.includeFacets ?? DEFAULT_INCLUDE_FACETS,
    phaseSlug: input.phaseSlug ?? undefined,
    from: input.from,
    highlight: input.highlight,
  } satisfies StructuredBody;
}

export function baseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL;
  if (fromEnv) {
    return fromEnv;
  }
  const fromVercel = process.env.VERCEL_URL;
  if (fromVercel) {
    return `https://${fromVercel}`;
  }
  return 'http://localhost:3000';
}

export function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function normaliseSuggestionCache(
  value: SuggestionResponse['cache'] | undefined,
): SuggestionResponse['cache'] {
  return SuggestionCacheSchema.parse(value ?? DEFAULT_SUGGESTION_CACHE);
}
