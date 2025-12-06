/**
 * Type definitions for Oak Curriculum API
 */

// Re-export generated types
export type { paths } from './generated/api-schema/api-paths-types';
export type { components } from './generated/api-schema/api-paths-types';

// Re-export path operations - Note: PATH_OPERATIONS is the const, PathOperation is the type
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './generated/api-schema/path-parameters';
export type { PathOperation, OperationId } from './generated/api-schema/path-parameters';

// Export the helpers

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
} from './generated/search/index';
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
} from './generated/search/index';

// Hybrid search facet types and schemas
export type { SequenceFacetUnit, SequenceFacet, SearchFacets } from './generated/search/index';
export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
} from './generated/zod/search/output/index';

// Response-shape type guards for search-related endpoints
export {
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
} from './search-response-guards';
export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
} from './search-response-guards';
