/**
 * Type definitions for Oak Curriculum API
 */

// Re-export generated types
export type { paths, components } from '@oaknational/sdk-codegen/api-schema';

// Re-export path operations - Note: PATH_OPERATIONS is the const, PathOperation is the type
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from '@oaknational/sdk-codegen/api-schema';
export type { PathOperation, OperationId } from '@oaknational/sdk-codegen/api-schema';

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
} from '@oaknational/sdk-codegen/search';
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
} from '@oaknational/sdk-codegen/search';

// Hybrid search facet types and schemas
export type {
  SequenceFacetUnit,
  SequenceFacet,
  SearchFacets,
} from '@oaknational/sdk-codegen/search';
export { SequenceFacetUnitSchema, SequenceFacetSchema } from '@oaknational/sdk-codegen/zod';
export { SearchFacetsSchema } from '@oaknational/sdk-codegen/search';

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
} from './search-response-guards.js';
export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
  SequenceUnitsResponse,
} from './search-response-guards.js';
