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

// Hybrid search index types and guards
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
} from './generated/search/index';
export type {
  SearchCompletionSuggestPayload,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
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
