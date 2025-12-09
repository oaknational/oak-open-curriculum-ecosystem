/**
 * @module subject-title-utils
 * @description Utilities for converting subject slugs to human-readable titles.
 *
 * This module provides a simple mapping from subject slugs to display titles.
 * Subject titles are reference data that rarely changes, so a static mapping
 * is acceptable and avoids additional API calls.
 */

import type { SearchSubjectSlug } from '../../types/oak';

/**
 * Mapping of subject slugs to human-readable titles.
 *
 * This is static reference data derived from the Oak curriculum.
 * Titles follow UK education conventions.
 */
const SUBJECT_TITLE_MAP: Readonly<Record<string, string>> = {
  art: 'Art and Design',
  citizenship: 'Citizenship',
  computing: 'Computing',
  'cooking-nutrition': 'Cooking and Nutrition',
  'design-technology': 'Design and Technology',
  english: 'English',
  french: 'French',
  geography: 'Geography',
  german: 'German',
  history: 'History',
  maths: 'Mathematics',
  music: 'Music',
  'physical-education': 'Physical Education',
  'religious-education': 'Religious Education',
  'rshe-pshe': 'RSHE/PSHE',
  science: 'Science',
  spanish: 'Spanish',
};

/**
 * Converts a subject slug to a human-readable title.
 *
 * Uses a static mapping for known subjects, or falls back to
 * title-casing the slug for unknown subjects.
 *
 * @example
 * ```typescript
 * getSubjectTitle('maths'); // 'Mathematics'
 * getSubjectTitle('english'); // 'English'
 * getSubjectTitle('design-technology'); // 'Design and Technology'
 * ```
 *
 * @param subjectSlug - The subject slug (e.g., 'maths', 'english')
 * @returns The human-readable title
 */
export function getSubjectTitle(subjectSlug: SearchSubjectSlug): string {
  const title = SUBJECT_TITLE_MAP[subjectSlug];
  if (title) {
    return title;
  }

  // Fallback: title-case the slug
  return subjectSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
