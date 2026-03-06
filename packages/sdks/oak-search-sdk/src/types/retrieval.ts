/**
 * Retrieval service interface — read-only search and suggestion operations.
 *
 * Per-scope methods with focused parameter types, as specified by
 * [ADR-107](../../../../docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md).
 * The SDK accepts structured, validated parameters — no natural language
 * parsing or intent extraction.
 *
 * Parameter types are in `retrieval-params.ts`.
 * Result types are in `retrieval-results.ts`.
 */

import type { Result } from '@oaknational/result';
import type { SearchFacets } from '@oaknational/sdk-codegen/search';
import type {
  SearchParamsBase,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
} from './retrieval-params.js';
import type {
  RetrievalError,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  ThreadsSearchResult,
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
  RetrievalError,
  LessonResult,
  UnitResult,
  SequenceResult,
  ThreadResult,
  SearchResultMeta,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  ThreadsSearchResult,
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
 * const result = await retrieval.searchLessons({
 *   query: 'photosynthesis',
 *   subject: 'science',
 *   keyStage: 'ks3',
 * });
 * if (result.ok) {
 *   console.log(result.value.results);
 * }
 *
 * const suggestResult = await retrieval.suggest({
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
   * @returns `ok` with ranked lesson results, or `err` with a `RetrievalError`
   */
  searchLessons(params: SearchLessonsParams): Promise<Result<LessonsSearchResult, RetrievalError>>;

  /**
   * Search units using hybrid RRF (BM25 + ELSER on Content and Structure).
   *
   * @param params - Structured search parameters
   * @returns `ok` with ranked unit results, or `err` with a `RetrievalError`
   */
  searchUnits(params: SearchUnitsParams): Promise<Result<UnitsSearchResult, RetrievalError>>;

  /**
   * Search sequences (API data structures for curriculum retrieval) using hybrid RRF.
   *
   * @param params - Structured search parameters
   * @returns `ok` with ranked sequence results, or `err` with a `RetrievalError`
   */
  searchSequences(
    params: SearchSequencesParams,
  ): Promise<Result<SequencesSearchResult, RetrievalError>>;

  /**
   * Search threads (conceptual progression strands) using two-way hybrid RRF.
   *
   * Threads are programme-agnostic strands that connect units across years,
   * showing how ideas build over time. The `subject` filter maps to the
   * `subject_slugs` array field in the thread index.
   *
   * @param params - Structured search parameters
   * @returns `ok` with ranked thread results, or `err` with a `RetrievalError`
   */
  searchThreads(params: SearchParamsBase): Promise<Result<ThreadsSearchResult, RetrievalError>>;

  /**
   * Type-ahead suggestions backed by completion contexts.
   *
   * @param params - Suggestion query parameters
   * @returns `ok` with suggestion items, or `err` with a `RetrievalError`
   */
  suggest(params: SuggestParams): Promise<Result<SuggestionResponse, RetrievalError>>;

  /**
   * Fetch sequence facet data for filtering UI.
   *
   * @param params - Optional subject/key stage filters
   * @returns `ok` with facet data, or `err` with a `RetrievalError`
   */
  fetchSequenceFacets(params?: FacetParams): Promise<Result<SearchFacets, RetrievalError>>;
}
