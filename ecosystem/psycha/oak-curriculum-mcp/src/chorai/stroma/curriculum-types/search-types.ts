/**
 * Search Types
 *
 * Types for curriculum search operations.
 */

import type { Programme, Unit, Lesson } from './curriculum-entities';

/**
 * Search parameters
 */
export interface CurriculumSearchParams {
  query: string;
  keyStages?: string[];
  subjects?: string[];
  yearGroups?: string[];
  contentTypes?: ('lessons' | 'units' | 'programmes')[];
  limit?: number;
  offset?: number;
}

/**
 * Search result item
 */
export interface SearchResultItem {
  type: 'lesson' | 'unit' | 'programme';
  data: Lesson | Unit | Programme;
  relevanceScore?: number;
  highlights?: string[];
}

/**
 * Search result
 */
export interface CurriculumSearchResult {
  results: SearchResultItem[];
  totalCount: number;
  hasMore: boolean;
  query: CurriculumSearchParams;
}
