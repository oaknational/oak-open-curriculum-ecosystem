/**
 * Search CLI handler functions.
 *
 * Each handler is a pure function that accepts an SDK retrieval service
 * and validated parameters. Handlers are tested via integration tests
 * with mock retrieval services.
 */

import type {
  RetrievalService,
  SearchLessonsParams,
  SearchUnitsParams,
  SearchSequencesParams,
  SuggestParams,
  FacetParams,
  LessonsSearchResult,
  UnitsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from '@oaknational/oak-search-sdk';
import type { SearchFacets } from '@oaknational/oak-curriculum-sdk/public/search.js';

/**
 * Search lessons via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns Lesson search results
 */
export async function handleSearchLessons(
  retrieval: RetrievalService,
  params: SearchLessonsParams,
): Promise<LessonsSearchResult> {
  return retrieval.searchLessons(params);
}

/**
 * Search units via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns Unit search results
 */
export async function handleSearchUnits(
  retrieval: RetrievalService,
  params: SearchUnitsParams,
): Promise<UnitsSearchResult> {
  return retrieval.searchUnits(params);
}

/**
 * Search sequences via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Validated search parameters
 * @returns Sequence search results
 */
export async function handleSearchSequences(
  retrieval: RetrievalService,
  params: SearchSequencesParams,
): Promise<SequencesSearchResult> {
  return retrieval.searchSequences(params);
}

/**
 * Get type-ahead suggestions via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Suggestion parameters (prefix, scope, optional filters)
 * @returns Suggestion response with items and cache metadata
 */
export async function handleSuggest(
  retrieval: RetrievalService,
  params: SuggestParams,
): Promise<SuggestionResponse> {
  return retrieval.suggest(params);
}

/**
 * Fetch sequence facets via the SDK retrieval service.
 *
 * @param retrieval - The SDK retrieval service
 * @param params - Optional filter parameters
 * @returns Sequence search result with facet data
 */
export async function handleFetchFacets(
  retrieval: RetrievalService,
  params: FacetParams,
): Promise<SearchFacets> {
  return retrieval.fetchSequenceFacets(params);
}
