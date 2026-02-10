/**
 * Retrieval service interface — read-only search and suggestion operations.
 *
 * Per-scope methods with focused parameter types, as specified by
 * [ADR-107](../../../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md).
 * The SDK accepts structured, validated parameters — no natural language
 * parsing or intent extraction.
 *
 * Parameter types are in {@link ./retrieval-params}.
 * Result types are in {@link ./retrieval-results}.
 *
 * @packageDocumentation
 */

import type { SearchFacets } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type {
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
} from './retrieval-params.js';
import type {
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from './retrieval-results.js';

// Re-export param and result types for convenience
export type {
  SearchParamsBase,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
} from './retrieval-params.js';

export type {
  LessonResult,
  UnitResult,
  SequenceResult,
  SearchResultMeta,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from './retrieval-results.js';

/**
 * Retrieval service — read-only search and suggestion operations.
 *
 * All methods accept structured, validated parameters and return
 * typed results. No natural language parsing occurs in the SDK.
 *
 * @example
 * ```typescript
 * const { retrieval } = createSearchSdk({ deps, config });
 *
 * const lessons = await retrieval.searchLessons({
 *   text: 'photosynthesis',
 *   subject: 'science',
 *   keyStage: 'ks3',
 * });
 *
 * const suggestions = await retrieval.suggest({
 *   prefix: 'photo',
 *   scope: 'lessons',
 * });
 * ```
 */
export interface RetrievalService {
  /**
   * Search lessons using hybrid RRF (BM25 + ELSER on Content and Structure).
   *
   * @param params - Structured search parameters
   * @returns Ranked lesson results with optional highlights
   */
  searchLessons(params: SearchLessonsParams): Promise<LessonsSearchResult>;

  /**
   * Search units using hybrid RRF (BM25 + ELSER on Content and Structure).
   *
   * @param params - Structured search parameters
   * @returns Ranked unit results with optional highlights
   */
  searchUnits(params: SearchUnitsParams): Promise<UnitsSearchResult>;

  /**
   * Search sequences (subject-phase programmes) using hybrid RRF.
   *
   * @param params - Structured search parameters
   * @returns Ranked sequence results with optional facets
   */
  searchSequences(params: SearchSequencesParams): Promise<SequencesSearchResult>;

  /**
   * Type-ahead suggestions backed by completion contexts.
   *
   * @param params - Suggestion query parameters
   * @returns Suggestion items with cache metadata
   */
  suggest(params: SuggestParams): Promise<SuggestionResponse>;

  /**
   * Fetch sequence facet data for filtering UI.
   *
   * @param params - Optional subject/key stage filters
   * @returns Facet data for sequence navigation
   */
  fetchSequenceFacets(params?: FacetParams): Promise<SearchFacets>;
}
