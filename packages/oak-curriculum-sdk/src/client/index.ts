/**
 * Oak Curriculum SDK client exports
 */

// Main factory
export { createOakClient } from './oak-client';
export type { OakCurriculumClient } from './oak-client';

// Types
export type { Lesson, Unit, Programme, SearchParams, SearchResults } from './types';

// Operations (for advanced users who want to use functions directly)
export { searchLessons } from './search';
export { transformLesson, transformSearchResults, buildSearchUrl } from './transform';
