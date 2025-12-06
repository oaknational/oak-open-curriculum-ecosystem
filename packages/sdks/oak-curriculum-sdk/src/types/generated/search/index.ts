/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Aggregated search exports derived from the Open Curriculum schema.
 */

export {
  DEFAULT_INCLUDE_FACETS,
  SearchStructuredRequestSchema,
  isSearchStructuredRequest,
} from './requests.js';
export type { SearchStructuredRequest, SearchStructuredScope } from './requests.js';

export {
  SearchNaturalLanguageRequestSchema,
  isSearchNaturalLanguageRequest,
} from './natural-requests.js';
export type { SearchNaturalLanguageRequest } from './natural-requests.js';

export { SearchParsedQuerySchema, isSearchParsedQuery } from './parsed-query.js';
export type { SearchParsedQuery, SearchParsedIntent } from './parsed-query.js';

export {
  SEARCH_SCOPES,
  SEARCH_SCOPES_WITH_ALL,
  isSearchScope,
  isSearchScopeWithAll,
} from './scopes.js';
export type { SearchScope, SearchScopeWithAll } from './scopes.js';

export {
  DEFAULT_SUGGESTION_CACHE,
  SearchSuggestionContextSchema,
  SearchSuggestionItemSchema,
  SearchSuggestionResponseSchema,
  SearchSuggestionRequestSchema,
  isSearchSuggestionRequest,
  isSearchSuggestionResponse,
} from './suggestions.js';
export type {
  SearchSuggestionItem,
  SearchSuggestionResponse,
  SearchSuggestionRequest,
} from './suggestions.js';

export {
  SearchLessonsCompletionContextsSchema,
  SearchUnitsCompletionContextsSchema,
  SearchUnitRollupCompletionContextsSchema,
  SearchSequenceCompletionContextsSchema,
  SearchThreadCompletionContextsSchema,
  SearchLessonsCompletionPayloadSchema,
  SearchUnitsCompletionPayloadSchema,
  SearchUnitRollupCompletionPayloadSchema,
  SearchSequenceCompletionPayloadSchema,
  SearchThreadCompletionPayloadSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  SearchThreadIndexDocSchema,
  IndexMetaDocSchema,
  ZeroHitDocSchema,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
  isSearchThreadIndexDoc,
  isIndexMetaDoc,
  isZeroHitDoc,
} from './index-documents.js';
export type {
  SearchLessonsCompletionContexts,
  SearchUnitsCompletionContexts,
  SearchUnitRollupCompletionContexts,
  SearchSequenceCompletionContexts,
  SearchThreadCompletionContexts,
  SearchLessonsCompletionPayload,
  SearchUnitsCompletionPayload,
  SearchUnitRollupCompletionPayload,
  SearchSequenceCompletionPayload,
  SearchThreadCompletionPayload,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchThreadIndexDoc,
  IndexMetaDoc,
  ZeroHitDoc,
  SearchSubjectSlug,
} from './index-documents.js';

export { SearchFacetsSchema } from '../zod/search/output/sequence-facets.js';
export type { SearchFacets, SequenceFacet, SequenceFacetUnit } from './facets.js';

export { SearchLessonsResponseSchema } from './responses.lessons.js';
export type {
  SearchLessonResult,
  SearchLessonsResponse,
  SearchLessonsSuggestions,
  SearchLessonsSuggestionCache,
} from './responses.lessons.js';

export { SearchUnitsResponseSchema } from './responses.units.js';
export type { SearchUnitResult, SearchUnitsResponse } from './responses.units.js';

export { SearchSequencesResponseSchema } from './responses.sequences.js';
export type { SearchSequenceResult, SearchSequencesResponse } from './responses.sequences.js';

export { SearchMultiScopeResponseSchema } from './responses.multi.js';
export type { SearchMultiScopeBucket, SearchMultiScopeResponse } from './responses.multi.js';

export {
  createSearchLessonsResponse,
  createSearchUnitsResponse,
  createSearchSequencesResponse,
  createSearchMultiScopeResponse,
} from './fixtures.js';

export {
  OAK_LESSONS_MAPPING,
  OAK_UNITS_MAPPING,
  OAK_UNIT_ROLLUP_MAPPING,
  OAK_SEQUENCES_MAPPING,
  OAK_SEQUENCE_FACETS_MAPPING,
  OAK_META_MAPPING,
} from './es-mappings/index.js';
export type {
  OakLessonsMapping,
  OakUnitsMapping,
  OakUnitRollupMapping,
  OakSequencesMapping,
  OakSequenceFacetsMapping,
  OakMetaMapping,
} from './es-mappings/index.js';
