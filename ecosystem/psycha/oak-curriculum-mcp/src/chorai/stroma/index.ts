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
