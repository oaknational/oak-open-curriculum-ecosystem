/**
 * Pure transformation functions for API data
 * These functions have no side effects and no I/O
 */

import { endpoints } from '../endpoints';
import type { ApiLesson, ApiSearchResponse } from './api-types';
import type { Lesson, SearchResults, SearchParams } from './types';

/**
 * Transform API lesson data to internal format
 * Pure function - no side effects, no I/O
 */
export function transformLesson(apiLesson: ApiLesson): Lesson {
  return {
    id: apiLesson.id,
    title: apiLesson.title,
    subject: apiLesson.subject_name,
    keyStage: apiLesson.key_stage_slug,
    unitSlug: apiLesson.unit_slug,
    yearGroup: apiLesson.year_group,
    description: apiLesson.lesson_description,
    durationMinutes: apiLesson.duration_minutes,
  };
}

/**
 * Transform search API response to internal format
 * Pure function - no side effects, no I/O
 */
export function transformSearchResults(apiResponse: ApiSearchResponse): SearchResults {
  return {
    total: apiResponse.total,
    page: apiResponse.page,
    limit: apiResponse.limit,
    lessons: apiResponse.lessons.map(transformLesson),
  };
}

/**
 * Build search URL from base URL and parameters
 * Pure function - no side effects, no I/O
 */
export function buildSearchUrl(baseUrl: string, params: SearchParams): string {
  const url = new URL(`${baseUrl}${endpoints.search}`);

  if (params.subject) {
    url.searchParams.set('subject', params.subject);
  }
  if (params.keyStage) {
    url.searchParams.set('keyStage', params.keyStage);
  }
  if (params.limit !== undefined) {
    url.searchParams.set('limit', params.limit.toString());
  }
  if (params.page !== undefined) {
    url.searchParams.set('page', params.page.toString());
  }

  return url.toString();
}
