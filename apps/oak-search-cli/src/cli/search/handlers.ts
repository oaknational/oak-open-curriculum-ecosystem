/**
 * Search CLI handler functions.
 *
 * Each handler is a thin pass-through that accepts an SDK retrieval service
 * and validated parameters, returning the `Result` from the SDK. Handlers
 * do not inspect or unwrap the Result — that responsibility belongs to the
 * command wiring layer.
 */

import type { Result } from '@oaknational/result';
import type {
  RetrievalService,
  RetrievalError,
  SearchParamsBase,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  ThreadsSearchResult,
  SuggestionResponse,
} from '@oaknational/oak-search-sdk/read';
import type { SearchFacets } from '@oaknational/sdk-codegen/search';
import { searchLogger } from '../../lib/logger';

/**
 * Search lessons via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns `ok` with lesson search results, or `err` with a `RetrievalError`
 */
export async function handleSearchLessons(
  retrieval: RetrievalService,
  params: SearchLessonsParams,
): Promise<Result<LessonsSearchResult, RetrievalError>> {
  searchLogger.debug('Handling lesson search command', { capability: 'search_lessons' });
  return retrieval.searchLessons(params);
}

/**
 * Search units via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns `ok` with unit search results, or `err` with a `RetrievalError`
 */
export async function handleSearchUnits(
  retrieval: RetrievalService,
  params: SearchUnitsParams,
): Promise<Result<UnitsSearchResult, RetrievalError>> {
  searchLogger.debug('Handling unit search command', { capability: 'search_units' });
  return retrieval.searchUnits(params);
}

/**
 * Search sequences via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns `ok` with sequence search results, or `err` with a `RetrievalError`
 */
export async function handleSearchSequences(
  retrieval: RetrievalService,
  params: SearchSequencesParams,
): Promise<Result<SequencesSearchResult, RetrievalError>> {
  searchLogger.debug('Handling sequence search command', { capability: 'search_sequences' });
  return retrieval.searchSequences(params);
}

/**
 * Search threads (conceptual progression strands) via the SDK retrieval service.
 *
 * Threads are programme-agnostic strands that connect units across years,
 * showing how ideas build over time.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns `ok` with thread search results, or `err` with a `RetrievalError`
 */
export async function handleSearchThreads(
  retrieval: RetrievalService,
  params: SearchParamsBase,
): Promise<Result<ThreadsSearchResult, RetrievalError>> {
  searchLogger.debug('Handling thread search command', { capability: 'search_threads' });
  return retrieval.searchThreads(params);
}

/**
 * Get type-ahead suggestions via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Suggestion parameters (prefix, scope, optional filters)
 * @returns `ok` with suggestion response, or `err` with a `RetrievalError`
 */
export async function handleSuggest(
  retrieval: RetrievalService,
  params: SuggestParams,
): Promise<Result<SuggestionResponse, RetrievalError>> {
  searchLogger.debug('Handling suggestion command', { capability: 'suggest' });
  return retrieval.suggest(params);
}

/**
 * Fetch sequence facets via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Optional filter parameters
 * @returns `ok` with facet data, or `err` with a `RetrievalError`
 */
export async function handleFetchFacets(
  retrieval: RetrievalService,
  params: FacetParams,
): Promise<Result<SearchFacets, RetrievalError>> {
  searchLogger.debug('Handling sequence facets command', { capability: 'fetch_sequence_facets' });
  return retrieval.fetchSequenceFacets(params);
}
