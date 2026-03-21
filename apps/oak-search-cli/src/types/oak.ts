/**
 * All search-related types MUST come from the SDK search entry point.
 * Core types (KeyStage, Subject) come from the main SDK entry point.
 * Search-response-guards (runtime validators for API responses) come
 * from curriculum-sdk; everything else comes from sdk-codegen.
 */

// Core types from main SDK entry point
export type { KeyStage, Subject as SearchSubjectSlug } from '@oaknational/curriculum-sdk';

// Subject hierarchy types for ADR-101 (KS4 science variants)
export type { AllSubjectSlug, ParentSubjectSlug } from '@oaknational/curriculum-sdk';

// Search schemas, constants, factories, and type guards from sdk-codegen
export {
  SearchFacetsSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  SearchThreadIndexDocSchema,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
  isSearchThreadIndexDoc,
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
} from '@oaknational/sdk-codegen/search';

export { SequenceFacetUnitSchema, SequenceFacetSchema } from '@oaknational/sdk-codegen/zod';

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
  SearchThreadIndexDoc,
} from '@oaknational/sdk-codegen/search';

// Search-response-guards: curriculum-sdk's own runtime validators
export {
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
  isSequenceUnitsResponse,
} from '@oaknational/curriculum-sdk/public/search.js';

export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
  SequenceUnitsResponse,
} from '@oaknational/curriculum-sdk/public/search.js';
