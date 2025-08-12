/**
 * Stroma Membrane
 *
 * The structural layer that defines the shape of the curriculum domain.
 * Exports pure types and contracts with no implementation.
 */

// Re-export all types
export type {
  KeyStage,
  Subject,
  Programme,
  Unit,
  Lesson,
  CurriculumSearchParams,
  SearchResultItem,
  CurriculumSearchResult,
} from './curriculum-types';

// Re-export all contracts
export type {
  SearchOperation,
  UnitOperations,
  LessonOperations,
  ProgrammeOperations,
  CurriculumOperations,
} from './curriculum-contracts';

// Export SDK client factory
export { createSdkClient } from './sdk-client';
export type { SdkClientConfig } from './sdk-client';

// Export shared operation types
export type { SearchLessonsParams } from './operation-types';

// Export organ contracts
export type {
  CurriculumOrganContract,
  KeyStage as OrganKeyStage,
  Subject as OrganSubject,
  LessonSummary as OrganLessonSummary,
  SearchResult as OrganSearchResult,
  SearchLessonsParams as OrganSearchLessonsParams,
} from './organ-contracts';
