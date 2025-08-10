/**
 * Main Oak Curriculum API client factory
 * Uses dependency injection for runtime-specific adapters
 */

import type { OakClientDependencies } from '../adapters/types';
import type { SearchParams, SearchResults } from './types';
import { searchLessons } from './search';

/**
 * Oak Curriculum client interface
 */
export interface OakCurriculumClient {
  /**
   * Search for lessons
   */
  searchLessons(params: SearchParams): Promise<SearchResults>;

  // Future methods will be added here:
  // getLesson(slug: string): Promise<Lesson>;
  // listProgrammes(): Promise<Programme[]>;
  // getUnit(slug: string): Promise<Unit>;
  // browseBySubject(subject: string): Promise<Subject>;
}

/**
 * Create an Oak Curriculum API client with injected dependencies
 * @param deps - HTTP adapter and configuration
 * @returns Client instance with all API operations
 */
export function createOakClient(deps: OakClientDependencies): OakCurriculumClient {
  // Validate configuration
  if (!deps.config.baseUrl) {
    throw new Error('Base URL required');
  }

  // Return client with bound operations
  return {
    searchLessons: (params: SearchParams) => searchLessons(deps, params),
    // Future operations will be added here
  };
}
