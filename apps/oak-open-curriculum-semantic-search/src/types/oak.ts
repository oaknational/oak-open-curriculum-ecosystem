/**
 * All search-related types MUST come from the SDK.
 */
export type { KeyStage, Subject as SearchSubjectSlug } from '@oaknational/oak-curriculum-sdk';

export {
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
} from '@oaknational/oak-curriculum-sdk';

export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
} from '@oaknational/oak-curriculum-sdk';

export {
  DEFAULT_INCLUDE_FACETS,
  SearchStructuredRequestSchema,
  isSearchStructuredRequest,
  SearchNaturalLanguageRequestSchema,
  isSearchNaturalLanguageRequest,
  SearchParsedQuerySchema,
  isSearchParsedQuery,
  SEARCH_SCOPES,
  SEARCH_SCOPES_WITH_ALL,
  isSearchScope,
  isSearchScopeWithAll,
  DEFAULT_SUGGESTION_CACHE,
  SearchSuggestionContextSchema,
  SearchSuggestionItemSchema,
  SearchSuggestionResponseSchema,
  SearchSuggestionRequestSchema,
  isSearchSuggestionRequest,
  isSearchSuggestionResponse,
  SearchLessonsResponseSchema,
  SearchUnitsResponseSchema,
  SearchSequencesResponseSchema,
  SearchMultiScopeResponseSchema,
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  createSearchMultiScopeResponse,
} from '@oaknational/oak-curriculum-sdk';

export {
  QueryParserRequestSchema,
  QueryParserResponseSchema,
  isQueryParserResponse,
} from '@oaknational/oak-curriculum-sdk';
export { QUERY_PARSER_INTENT_ENUM } from '@oaknational/oak-curriculum-sdk';

export type {
  SearchStructuredRequest,
  SearchStructuredScope,
  SearchNaturalLanguageRequest,
  SearchParsedQuery,
  SearchParsedIntent,
  SearchScope,
  SearchScopeWithAll,
  SearchSuggestionItem,
  SearchSuggestionResponse,
  SearchSuggestionRequest,
  SearchLessonResult,
  SearchLessonsResponse,
  SearchLessonsSuggestions,
  SearchLessonsSuggestionCache,
  SearchUnitResult,
  SearchUnitsResponse,
  SearchSequenceResult,
  SearchSequencesResponse,
  SearchMultiScopeBucket,
  SearchMultiScopeResponse,
  SequenceFacetUnit,
  SequenceFacet,
  SearchFacets,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchCompletionSuggestPayload,
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
} from '@oaknational/oak-curriculum-sdk';
export type {
  QueryParserRequest,
  QueryParserResponse,
  QueryParserIntent,
} from '@oaknational/oak-curriculum-sdk';
