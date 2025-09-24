/**
 * All search-related types MUST come from the SDK.
 */
export type { KeyStage, Subject as SearchSubjectSlug } from '@oaknational/oak-curriculum-sdk';
export type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchCompletionSuggestPayload,
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
  SequenceFacetUnit,
  SequenceFacet,
  SearchFacets,
} from '@oaknational/oak-curriculum-sdk';
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
