/**
 * Domain types for the Oak Curriculum SDK
 * These are the internal representations used throughout the SDK
 */

/**
 * Internal lesson representation
 */
export interface Lesson {
  id: string;
  title: string;
  subject: string;
  keyStage: string;
  unitSlug?: string;
  yearGroup?: number;
  description?: string;
  durationMinutes?: number;
}

/**
 * Search results structure
 */
export interface SearchResults {
  total: number;
  page: number;
  limit: number;
  lessons: Lesson[];
}

/**
 * Search parameters
 */
export interface SearchParams {
  subject?: string;
  keyStage?: string;
  limit?: number;
  page?: number;
}

/**
 * Internal unit representation
 */
export interface Unit {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

/**
 * Internal programme representation
 */
export interface Programme {
  id: string;
  title: string;
  subject: string;
  keyStage: string;
  units: Unit[];
}
