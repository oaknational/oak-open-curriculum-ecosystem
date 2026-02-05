/**
 * Ground truth relevance judgments for search quality evaluation.
 *
 * This module exports the NEW ground truth system only (Phase 1 minimal ground truths).
 * For the archived 120-query system, import directly from `./ground-truth-archive/`.
 *
 * @see ./ground-truth/index.ts for full documentation
 * @packageDocumentation
 */

export {
  GROUND_TRUTHS,
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
  getGroundTruth,
  getGroundTruthsForSubject,
  getGroundTruthsForPhase,
  type MinimalGroundTruth,
  type Phase,
  type SubjectPhasePair,
  subjectPhaseKey,
} from './ground-truth/index';
