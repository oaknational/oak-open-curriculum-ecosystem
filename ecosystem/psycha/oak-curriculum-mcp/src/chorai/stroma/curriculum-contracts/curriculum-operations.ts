/**
 * Curriculum Operations Contracts
 *
 * Defines the interface contracts for Oak Curriculum operations.
 * These are pure type definitions with no implementation.
 */

import type {
  CurriculumSearchParams,
  CurriculumSearchResult,
} from '../curriculum-types/search-types';
import type { Unit, Lesson, Programme } from '../curriculum-types/curriculum-entities';

/**
 * Search operation contract
 */
export interface SearchOperation {
  search(params: CurriculumSearchParams): Promise<CurriculumSearchResult>;
}

/**
 * Unit operations contract
 */
export interface UnitOperations {
  getUnit(unitId: string): Promise<Unit>;
  listUnits(programmeId: string): Promise<Unit[]>;
}

/**
 * Lesson operations contract
 */
export interface LessonOperations {
  getLesson(lessonSlug: string): Promise<Lesson>;
  listLessons(unitId: string): Promise<Lesson[]>;
}

/**
 * Programme operations contract
 */
export interface ProgrammeOperations {
  getProgramme(programmeSlug: string): Promise<Programme>;
  listProgrammes(): Promise<Programme[]>;
}

/**
 * Complete curriculum operations interface
 */
export interface CurriculumOperations
  extends SearchOperation,
    UnitOperations,
    LessonOperations,
    ProgrammeOperations {}
