import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { FileMap } from '../extraction-types.js';

const HEADER = `/**\n * GENERATED FILE - DO NOT EDIT\n *\n * Aggregated search exports derived from the Open Curriculum schema.\n */\n\n`;

function createIndexModule(): string {
  return (
    HEADER +
    String.raw`export {
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
  SearchCompletionSuggestPayloadSchema,
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchUnitRollupDocSchema,
  SearchSequenceIndexDocSchema,
  isSearchCompletionSuggestPayload,
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
} from './index-documents.js';
export type {
  SearchCompletionSuggestPayload,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
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
`
  );
}

export function generateSearchIndexModule(_schema: OpenAPIObject): FileMap {
  void _schema;
  return {
    '../search/index.ts': createIndexModule(),
  };
}
