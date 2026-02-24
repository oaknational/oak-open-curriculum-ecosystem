/**
 * Local search retrieval service interface for MCP tool consumption.
 *
 * Defines the contract between the curriculum SDK's search tools and
 * the search service implementation (provided via dependency injection).
 * This interface is STRUCTURALLY COMPATIBLE with the Search SDK's
 * `RetrievalService`, but does NOT import from it — breaking the
 * circular dependency between curriculum-sdk and search-sdk.
 *
 * The MCP servers wire the real Search SDK instance to this interface.
 * TypeScript structural typing ensures compatibility at the wiring point.
 *
 * @remarks
 * All document types (SearchLessonsIndexDoc, etc.) flow from the
 * curriculum SDK's own generated types. The search SDK imports the
 * same types from curriculum-sdk, guaranteeing structural compatibility.
 */

import type { Result } from '@oaknational/result';
import type { KeyStage, Subject } from '@oaknational/curriculum-sdk-generation/api-schema';
import type {
  SearchScope,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchSequenceIndexDoc,
  SearchThreadIndexDoc,
  SearchFacets,
  SearchSuggestionItem,
} from '@oaknational/curriculum-sdk-generation/search';

// ---------------------------------------------------------------------------
// Error type (structurally matches search-sdk RetrievalError)
// ---------------------------------------------------------------------------

/** Error type for search retrieval operations. Discriminated union on `type`. */
export type SearchRetrievalError =
  | { readonly type: 'es_error'; readonly message: string; readonly statusCode?: number }
  | { readonly type: 'timeout'; readonly message: string }
  | { readonly type: 'validation_error'; readonly message: string }
  | { readonly type: 'unknown'; readonly message: string };

// ---------------------------------------------------------------------------
// Search parameter types (structurally match search-sdk params)
// ---------------------------------------------------------------------------

/** Common parameters shared across all search scopes. */
export interface SearchParamsBase {
  readonly text: string;
  readonly subject?: Subject;
  readonly keyStage?: KeyStage;
  readonly size?: number;
  readonly from?: number;
}

/** Parameters for lesson search. */
export interface SearchLessonsParams extends SearchParamsBase {
  readonly highlight?: boolean;
  readonly unitSlug?: string;
  readonly tier?: string;
  readonly examBoard?: string;
  readonly examSubject?: string;
  readonly ks4Option?: string;
  readonly year?: string;
  readonly threadSlug?: string;
}

/** Parameters for unit search. */
export interface SearchUnitsParams extends SearchParamsBase {
  readonly highlight?: boolean;
  readonly minLessons?: number;
}

/** Parameters for sequence search. */
export interface SearchSequencesParams extends SearchParamsBase {
  readonly phaseSlug?: string;
  readonly category?: string;
  readonly includeFacets?: boolean;
}

/** Parameters for typeahead suggestions. */
export interface SuggestParams {
  readonly prefix: string;
  readonly scope: SearchScope;
  readonly subject?: Subject;
  readonly keyStage?: KeyStage;
  readonly phaseSlug?: string;
  readonly limit?: number;
}

/** Parameters for fetching sequence facets. */
export interface FacetParams {
  readonly subject?: Subject;
  readonly keyStage?: KeyStage;
}

// ---------------------------------------------------------------------------
// Search result types (structurally match search-sdk results)
// ---------------------------------------------------------------------------

/** Metadata common to all search results. */
export interface SearchResultMeta {
  readonly total: number;
  readonly took: number;
  readonly timedOut: boolean;
  readonly facets?: SearchFacets;
}

/** A single lesson result. */
export interface LessonResult {
  readonly id: string;
  readonly rankScore: number;
  readonly lesson: SearchLessonsIndexDoc;
  readonly highlights: readonly string[];
}

/** A single unit result. */
export interface UnitResult {
  readonly id: string;
  readonly rankScore: number;
  readonly unit: SearchUnitsIndexDoc | null;
  readonly highlights: readonly string[];
}

/** A single sequence result. */
export interface SequenceResult {
  readonly id: string;
  readonly rankScore: number;
  readonly sequence: SearchSequenceIndexDoc;
}

/** A single thread result. */
export interface ThreadResult {
  readonly id: string;
  readonly rankScore: number;
  readonly thread: SearchThreadIndexDoc;
}

/** Lessons search result. */
export interface LessonsSearchResult extends SearchResultMeta {
  readonly scope: 'lessons';
  readonly results: readonly LessonResult[];
}

/** Units search result. */
export interface UnitsSearchResult extends SearchResultMeta {
  readonly scope: 'units';
  readonly results: readonly UnitResult[];
}

/** Sequences search result. */
export interface SequencesSearchResult extends SearchResultMeta {
  readonly scope: 'sequences';
  readonly results: readonly SequenceResult[];
}

/** Threads search result. */
export interface ThreadsSearchResult extends SearchResultMeta {
  readonly scope: 'threads';
  readonly results: readonly ThreadResult[];
}

/** Suggestion response with cache metadata. */
export interface SuggestionResponse {
  readonly suggestions: readonly SearchSuggestionItem[];
  readonly cache: {
    readonly version: string;
    readonly ttlSeconds: number;
  };
}

// ---------------------------------------------------------------------------
// Search Units Index Doc (structurally matches search-sdk's usage)
// ---------------------------------------------------------------------------

/**
 * Unit index document type used in search results.
 *
 * The search SDK uses `SearchUnitsIndexDoc` from the curriculum SDK.
 * We re-export the type here so search-retrieval-types is self-contained
 * for consumers that need the full result shape.
 */
export type { SearchUnitsIndexDoc } from '@oaknational/curriculum-sdk-generation/search';

// ---------------------------------------------------------------------------
// The search retrieval service interface
// ---------------------------------------------------------------------------

/**
 * Interface for the search retrieval service injected into MCP tools.
 *
 * Structurally matches the Search SDK's `RetrievalService` interface.
 * The MCP servers create the real Search SDK instance and pass it here.
 *
 * @example
 * ```typescript
 * // In MCP server wiring:
 * import { createSearchSdk } from '@oaknational/oak-search-sdk';
 *
 * const sdk = createSearchSdk({ deps: { esClient }, config: { ... } });
 * const deps = { searchRetrieval: sdk.retrieval };
 * ```
 */
export interface SearchRetrievalService {
  searchLessons(
    params: SearchLessonsParams,
  ): Promise<Result<LessonsSearchResult, SearchRetrievalError>>;

  searchUnits(params: SearchUnitsParams): Promise<Result<UnitsSearchResult, SearchRetrievalError>>;

  searchSequences(
    params: SearchSequencesParams,
  ): Promise<Result<SequencesSearchResult, SearchRetrievalError>>;

  searchThreads(
    params: SearchParamsBase,
  ): Promise<Result<ThreadsSearchResult, SearchRetrievalError>>;

  suggest(params: SuggestParams): Promise<Result<SuggestionResponse, SearchRetrievalError>>;

  fetchSequenceFacets(params?: FacetParams): Promise<Result<SearchFacets, SearchRetrievalError>>;
}
