/**
 * API response types - these match the raw API responses
 * Used as input for transformation functions
 */

/**
 * Raw lesson data from API
 */
export interface ApiLesson {
  id: string;
  title: string;
  subject_name: string;
  key_stage_slug: string;
  unit_slug?: string;
  year_group?: number;
  lesson_description?: string;
  duration_minutes?: number;
}

/**
 * Raw search response from API
 */
export interface ApiSearchResponse {
  total: number;
  page: number;
  limit: number;
  lessons: ApiLesson[];
}

/**
 * Raw unit data from API
 */
export interface ApiUnit {
  id: string;
  title: string;
  description?: string;
  lessons: ApiLesson[];
}

/**
 * Raw programme data from API
 */
export interface ApiProgramme {
  id: string;
  title: string;
  subject_slug: string;
  key_stage_slug: string;
  units: ApiUnit[];
}
