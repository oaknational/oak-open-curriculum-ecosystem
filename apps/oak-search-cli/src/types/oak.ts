/**
 * All search-related types MUST come from the SDK search entry point.
 * Core types (KeyStage, Subject) come from the main SDK entry point.
 * Search-response-guards (runtime validators for API responses) come
 * from curriculum-sdk; everything else comes from sdk-codegen.
 */

// Core types from main SDK entry point
export type { KeyStage, Subject as SearchSubjectSlug } from '@oaknational/curriculum-sdk';

// Subject hierarchy types for ADR-101 (KS4 science variants)
export type { AllSubjectSlug, ParentSubjectSlug } from '@oaknational/curriculum-sdk';

export type {
  SearchScope,
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSequenceIndexDoc,
  SearchThreadIndexDoc,
} from '@oaknational/sdk-codegen/search';

// Search-response-guards: curriculum-sdk's own runtime validators
export {
  isLessonSummary,
  isUnitSummary,
  isSubjectSequences,
  isSequenceUnitsResponse,
} from '@oaknational/curriculum-sdk/public/search.js';

export type {
  SearchLessonSummary,
  SearchUnitSummary,
  SearchSubjectSequences,
  SequenceUnitsResponse,
} from '@oaknational/curriculum-sdk/public/search.js';
