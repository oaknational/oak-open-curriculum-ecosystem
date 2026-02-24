/**
 * Type definitions for Oak Curriculum API
 */

// Re-export generated types
export type { paths, components } from '@oaknational/curriculum-sdk-generation/api-schema';

// Re-export path operations - Note: PATH_OPERATIONS is the const, PathOperation is the type
export {
  PATH_OPERATIONS,
  OPERATIONS_BY_ID,
} from '@oaknational/curriculum-sdk-generation/api-schema';
export type { PathOperation, OperationId } from '@oaknational/curriculum-sdk-generation/api-schema';

// Hybrid search index types and guards (per-index completion schemas)
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
  isSearchLessonsIndexDoc,
  isSearchUnitsIndexDoc,
  isSearchUnitRollupDoc,
  isSearchSequenceIndexDoc,
  isSearchThreadIndexDoc,
} from '@oaknational/curriculum-sdk-generation/search';
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
  SearchSubjectSlug,
} from '@oaknational/curriculum-sdk-generation/search';

// Hybrid search facet types and schemas
export type {
  SequenceFacetUnit,
  SequenceFacet,
  SearchFacets,
} from '@oaknational/curriculum-sdk-generation/search';
export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
} from '@oaknational/curriculum-sdk-generation/zod';
export { SearchFacetsSchema } from '@oaknational/curriculum-sdk-generation/search';

// Response-shape type guards for search-related endpoints
export {
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
  sequenceUnitsSchema,
  isSequenceUnitsResponse,
} from './search-response-guards';
export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
  SequenceUnitsResponse,
} from './search-response-guards';
