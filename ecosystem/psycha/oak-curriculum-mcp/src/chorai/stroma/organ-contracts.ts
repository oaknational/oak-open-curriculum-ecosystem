/**
 * Organ Contracts
 *
 * Defines the interface contracts between organs in the Oak Curriculum MCP server.
 * These contracts allow organs to interact without directly importing from each other,
 * maintaining the biological architecture's organ independence.
 */

import type { components } from '@oaknational/oak-curriculum-sdk';

// Export specific types from SDK for organ contracts
export type KeyStage = components['schemas']['KeyStageResponseSchema'][number];
export type Subject = components['schemas']['AllSubjectsResponseSchema'][number];
export type LessonSummary = components['schemas']['LessonSummaryResponseSchema'];
export type SearchResult = components['schemas']['LessonSearchResponseSchema'][number];

/**
 * Search parameters for lessons
 */
export interface SearchLessonsParams {
  q: string;
  keyStage?: string;
  subject?: string;
  examBoard?: string;
  yearGroup?: string;
  contentType?: 'lesson' | 'unit';
  limit?: number;
  offset?: number;
}

/**
 * Curriculum organ operations contract
 *
 * This interface defines what operations the curriculum organ provides
 * to other organs (like the MCP organ) without requiring direct imports.
 */
export interface CurriculumOrganContract {
  searchLessons(params: SearchLessonsParams): Promise<SearchResult[]>;
  getLesson(lessonSlug: string): Promise<LessonSummary>;
  listKeyStages(): Promise<KeyStage[]>;
  listSubjects(): Promise<Subject[]>;
}
