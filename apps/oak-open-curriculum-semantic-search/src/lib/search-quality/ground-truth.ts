/**
 * Lesson ground truth relevance judgments for search quality evaluation.
 *
 * This module exports the lesson ground truth system.
 * For the archived 120-query system, import directly from `./ground-truth-archive/`.
 *
 * @see ./ground-truth/index.ts for full documentation
 * @packageDocumentation
 */

export {
  LESSON_GROUND_TRUTHS,
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
  MATHS_PRIMARY,
  MATHS_SECONDARY,
  MUSIC_PRIMARY,
  MUSIC_SECONDARY,
  PHYSICAL_EDUCATION_PRIMARY,
  PHYSICAL_EDUCATION_SECONDARY,
  RELIGIOUS_EDUCATION_PRIMARY,
  RELIGIOUS_EDUCATION_SECONDARY,
  SCIENCE_PRIMARY,
  GEOGRAPHY_PRIMARY,
  GEOGRAPHY_SECONDARY,
  GERMAN_SECONDARY,
  HISTORY_PRIMARY,
  HISTORY_SECONDARY,
  SCIENCE_SECONDARY,
  SPANISH_PRIMARY,
  SPANISH_SECONDARY,
  getLessonGroundTruth,
  getLessonGroundTruthsForSubject,
  getLessonGroundTruthsForPhase,
  type LessonGroundTruth,
  type Phase,
  type SubjectPhasePair,
  subjectPhaseKey,
} from './ground-truth/index';
