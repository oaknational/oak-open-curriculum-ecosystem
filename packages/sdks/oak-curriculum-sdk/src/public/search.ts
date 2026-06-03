/**
 * Search-response-guards: curriculum-sdk's own runtime validators for
 * Oak API search responses. These are NOT re-exports from sdk-codegen.
 *
 * For search schemas, constants, type guards, and factory functions,
 * import directly from `@oaknational/sdk-codegen/search` (or the
 * appropriate subpath: `/query-parser`, `/observability`, `/admin`,
 * `/zod`). See ADR-108.
 */

export {
  lessonSummarySchema,
  unitSummarySchema,
  isUnitsGrouped,
  isLessonGroups,
  isTranscriptResponse,
  isLessonSummary,
  isUnitSummary,
  subjectDetailSchema,
  isSubjectDetail,
  type LessonSummaryResponseSchema,
  type UnitSummaryResponseSchema,
  type SubjectResponseSchema,
  type SubjectDetail,
  type SearchLessonSummary,
  type SearchUnitSummary,
  sequenceUnitsSchema,
  type SequenceUnitsResponseSchema,
  type SequenceUnitsResponse,
  isSequenceUnitsResponse,
  subjectAssetsSchema,
  type SubjectAssetsResponseSchema,
  type SubjectAssets,
  isSubjectAssets,
} from '../types/search-response-guards.js';

export { extractLessonUnits, formatPrimaryUnit } from '../lesson-resource-helpers.js';
