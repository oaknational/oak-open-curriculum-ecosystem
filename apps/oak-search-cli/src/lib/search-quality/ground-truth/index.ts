/**
 * Lesson Ground Truths.
 *
 * Two categories of ground truths:
 *
 * 1. **Per-subject**: One ground truth per subject-phase pair (~33 total).
 *    Uses known-answer-first methodology to prove baseline search quality.
 * 2. **Cross-subject**: Unfiltered queries that test search quality across
 *    the entire curriculum without subject filtering.
 *
 * ## Coverage Target
 *
 * | Phase     | Subjects |
 * |-----------|----------|
 * | Primary   | ~15      |
 * | Secondary | ~18      |
 * | **Total** | **~33**  |
 *
 * ## Usage
 *
 * ```typescript
 * import {
 *   LESSON_GROUND_TRUTHS,
 *   CROSS_SUBJECT_LESSON_GROUND_TRUTHS,
 *   getLessonGroundTruth,
 * } from './ground-truth';
 *
 * // Get all per-subject lesson ground truths
 * for (const gt of LESSON_GROUND_TRUTHS) {
 *   console.log(`${gt.subject}/${gt.phase}: ${gt.query}`);
 * }
 *
 * // Get cross-subject ground truths
 * for (const gt of CROSS_SUBJECT_LESSON_GROUND_TRUTHS) {
 *   console.log(`cross-subject: ${gt.query}`);
 * }
 *
 * // Get specific lesson ground truth
 * const mathsSec = getLessonGroundTruth('maths', 'secondary');
 * ```
 */

import type { AllSubjectSlug } from '@oaknational/curriculum-sdk';

import type { CrossSubjectLessonGroundTruth, LessonGroundTruth, Phase } from './types.js';

export type {
  LessonGroundTruth,
  CrossSubjectLessonGroundTruth,
  SubjectPhasePair,
  Phase,
  SubjectPhaseKey,
} from './types.js';
export { subjectPhaseKey } from './types';

// =============================================================================
// Ground Truth Entries
// =============================================================================

// Import individual ground truths as they are created
import { ART_PRIMARY } from './entries/art-primary';
import { ART_SECONDARY } from './entries/art-secondary';
import { CITIZENSHIP_SECONDARY } from './entries/citizenship-secondary';
import { COOKING_NUTRITION_PRIMARY } from './entries/cooking-nutrition-primary';
import { COOKING_NUTRITION_SECONDARY } from './entries/cooking-nutrition-secondary';
import { COMPUTING_PRIMARY } from './entries/computing-primary';
import { COMPUTING_SECONDARY } from './entries/computing-secondary';
import { DESIGN_TECHNOLOGY_PRIMARY } from './entries/design-technology-primary';
import { DESIGN_TECHNOLOGY_SECONDARY } from './entries/design-technology-secondary';
import { ENGLISH_PRIMARY } from './entries/english-primary';
import { ENGLISH_SECONDARY } from './entries/english-secondary';
import { FRENCH_PRIMARY } from './entries/french-primary';
import { FRENCH_SECONDARY } from './entries/french-secondary';
import { GEOGRAPHY_PRIMARY } from './entries/geography-primary';
import { GERMAN_SECONDARY } from './entries/german-secondary';
import { GEOGRAPHY_SECONDARY } from './entries/geography-secondary';
import { HISTORY_PRIMARY } from './entries/history-primary';
import { HISTORY_SECONDARY } from './entries/history-secondary';
import { MATHS_PRIMARY } from './entries/maths-primary';
import { MUSIC_PRIMARY } from './entries/music-primary';
import { MUSIC_SECONDARY } from './entries/music-secondary';
import { RELIGIOUS_EDUCATION_PRIMARY } from './entries/religious-education-primary';
import { RELIGIOUS_EDUCATION_SECONDARY } from './entries/religious-education-secondary';
import { MATHS_SECONDARY } from './entries/maths-secondary';
import { PHYSICAL_EDUCATION_PRIMARY } from './entries/physical-education-primary';
import { PHYSICAL_EDUCATION_SECONDARY } from './entries/physical-education-secondary';
import { SCIENCE_PRIMARY } from './entries/science-primary';
import { SCIENCE_SECONDARY } from './entries/science-secondary';
import { SPANISH_PRIMARY } from './entries/spanish-primary';
import { SPANISH_SECONDARY } from './entries/spanish-secondary';

// Cross-subject ground truths
import { APPLE_LESSONS } from './cross-subject/apple-lessons';
import { TREE_LESSONS } from './cross-subject/tree-lessons';
import { MOUNTAIN_LESSONS } from './cross-subject/mountain-lessons';

/**
 * All lesson ground truths in the system.
 *
 * This array grows as ground truths are created for each subject-phase pair.
 */
export const LESSON_GROUND_TRUTHS: readonly LessonGroundTruth[] = [
  ART_PRIMARY,
  ART_SECONDARY,
  CITIZENSHIP_SECONDARY,
  COOKING_NUTRITION_PRIMARY,
  COOKING_NUTRITION_SECONDARY,
  COMPUTING_PRIMARY,
  COMPUTING_SECONDARY,
  DESIGN_TECHNOLOGY_PRIMARY,
  DESIGN_TECHNOLOGY_SECONDARY,
  ENGLISH_PRIMARY,
  ENGLISH_SECONDARY,
  FRENCH_PRIMARY,
  FRENCH_SECONDARY,
  GEOGRAPHY_PRIMARY,
  GEOGRAPHY_SECONDARY,
  GERMAN_SECONDARY,
  HISTORY_PRIMARY,
  HISTORY_SECONDARY,
  MATHS_PRIMARY,
  MATHS_SECONDARY,
  MUSIC_PRIMARY,
  MUSIC_SECONDARY,
  PHYSICAL_EDUCATION_PRIMARY,
  PHYSICAL_EDUCATION_SECONDARY,
  RELIGIOUS_EDUCATION_PRIMARY,
  RELIGIOUS_EDUCATION_SECONDARY,
  SCIENCE_PRIMARY,
  SCIENCE_SECONDARY,
  SPANISH_PRIMARY,
  SPANISH_SECONDARY,
] as const;

// Re-export individual entries for direct access
export { ART_PRIMARY } from './entries/art-primary';
export { ART_SECONDARY } from './entries/art-secondary';
export { CITIZENSHIP_SECONDARY } from './entries/citizenship-secondary';
export { COOKING_NUTRITION_PRIMARY } from './entries/cooking-nutrition-primary';
export { COOKING_NUTRITION_SECONDARY } from './entries/cooking-nutrition-secondary';
export { COMPUTING_PRIMARY } from './entries/computing-primary';
export { COMPUTING_SECONDARY } from './entries/computing-secondary';
export { DESIGN_TECHNOLOGY_PRIMARY } from './entries/design-technology-primary';
export { DESIGN_TECHNOLOGY_SECONDARY } from './entries/design-technology-secondary';
export { ENGLISH_PRIMARY } from './entries/english-primary';
export { ENGLISH_SECONDARY } from './entries/english-secondary';
export { FRENCH_PRIMARY } from './entries/french-primary';
export { FRENCH_SECONDARY } from './entries/french-secondary';
export { GEOGRAPHY_PRIMARY } from './entries/geography-primary';
export { GEOGRAPHY_SECONDARY } from './entries/geography-secondary';
export { GERMAN_SECONDARY } from './entries/german-secondary';
export { HISTORY_PRIMARY } from './entries/history-primary';
export { HISTORY_SECONDARY } from './entries/history-secondary';
export { MATHS_PRIMARY } from './entries/maths-primary';
export { MATHS_SECONDARY } from './entries/maths-secondary';
export { MUSIC_PRIMARY } from './entries/music-primary';
export { MUSIC_SECONDARY } from './entries/music-secondary';
export { PHYSICAL_EDUCATION_PRIMARY } from './entries/physical-education-primary';
export { PHYSICAL_EDUCATION_SECONDARY } from './entries/physical-education-secondary';
export { RELIGIOUS_EDUCATION_PRIMARY } from './entries/religious-education-primary';
export { RELIGIOUS_EDUCATION_SECONDARY } from './entries/religious-education-secondary';
export { SCIENCE_PRIMARY } from './entries/science-primary';
export { SCIENCE_SECONDARY } from './entries/science-secondary';
export { SPANISH_PRIMARY } from './entries/spanish-primary';
export { SPANISH_SECONDARY } from './entries/spanish-secondary';

// =============================================================================
// Cross-Subject Ground Truth Entries
// =============================================================================

export { APPLE_LESSONS } from './cross-subject/apple-lessons';
export { TREE_LESSONS } from './cross-subject/tree-lessons';
export { MOUNTAIN_LESSONS } from './cross-subject/mountain-lessons';

/**
 * All cross-subject lesson ground truths.
 *
 * These test search quality for queries without subject filtering,
 * capturing scenarios where unfiltered search must return relevant
 * results across the entire curriculum.
 */
export const CROSS_SUBJECT_LESSON_GROUND_TRUTHS: readonly CrossSubjectLessonGroundTruth[] = [
  APPLE_LESSONS,
  TREE_LESSONS,
  MOUNTAIN_LESSONS,
] as const;

// =============================================================================
// Accessors
// =============================================================================

/**
 * Get a lesson ground truth by subject and phase.
 *
 * @param subject - The subject slug
 * @param phase - The phase (primary or secondary)
 * @returns The lesson ground truth if found, undefined otherwise
 */
export function getLessonGroundTruth(
  subject: AllSubjectSlug,
  phase: Phase,
): LessonGroundTruth | undefined {
  return LESSON_GROUND_TRUTHS.find((gt) => gt.subject === subject && gt.phase === phase);
}

/**
 * Get all lesson ground truths for a subject.
 *
 * @param subject - The subject slug
 * @returns Array of lesson ground truths for that subject (may be 0, 1, or 2)
 */
export function getLessonGroundTruthsForSubject(
  subject: AllSubjectSlug,
): readonly LessonGroundTruth[] {
  return LESSON_GROUND_TRUTHS.filter((gt) => gt.subject === subject);
}

/**
 * Get all lesson ground truths for a phase.
 *
 * @param phase - The phase (primary or secondary)
 * @returns Array of lesson ground truths for that phase
 */
export function getLessonGroundTruthsForPhase(phase: Phase): readonly LessonGroundTruth[] {
  return LESSON_GROUND_TRUTHS.filter((gt) => gt.phase === phase);
}
