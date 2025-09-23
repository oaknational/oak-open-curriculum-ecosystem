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
} from '@oaknational/oak-curriculum-sdk';
export {
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
} from '@oaknational/oak-curriculum-sdk';
