/**
 * Type definitions for Oak Curriculum API
 */

export type { OpenAPI3 } from './openapi.js';

// Re-export generated types
export type { paths } from './generated/api-schema/api-paths-types';
export type { components } from './generated/api-schema/api-paths-types';

// Re-export path operations - Note: PATH_OPERATIONS is the const, PathOperation is the type
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './generated/api-schema/path-parameters.js';
export type { PathOperation, OperationId } from './generated/api-schema/path-parameters';

// Export the helpers
export {
  typeSafeKeys,
  typeSafeValues,
  typeSafeEntries,
  typeSafeFromEntries,
  typeSafeGet,
  typeSafeSet,
  typeSafeHas,
  typeSafeHasOwn,
  typeSafeOwnKeys,
} from './helpers.js';

// Hybrid search index types
export type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchSubjectSlug,
  SearchCompletionSuggestPayload,
} from './search-index.js';

// Hybrid search facet types and schemas
export type { SequenceFacetUnit, SequenceFacet, SearchFacets } from './generated/search/index.js';
export {
  SequenceFacetUnitSchema,
  SequenceFacetSchema,
  SearchFacetsSchema,
} from './generated/zod/search/output/index.js';

// Response-shape type guards for search-related endpoints
export {
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
} from './search-response-guards.js';
export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
} from './search-response-guards.js';
