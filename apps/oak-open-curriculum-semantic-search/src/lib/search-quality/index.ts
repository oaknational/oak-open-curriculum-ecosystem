/**
 * Search quality evaluation utilities.
 *
 * This module provides IR metrics and ground truth for evaluating search quality.
 *
 * ## Ground Truth Systems
 *
 * - **New system**: `MinimalGroundTruth` — One ground truth per subject-phase (~33 total)
 * - **Archive**: `GroundTruthQuery` — Legacy 120-query system (import from `ground-truth-archive/`)
 *
 * @packageDocumentation
 */

export { calculateMRR, calculateNDCG } from './metrics';

// New system (Phase 1 minimal ground truths)
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
} from './ground-truth';

// Archive (legacy 120-query system) — imported directly from archive
export {
  ALL_GROUND_TRUTH_QUERIES,
  MATHS_ALL_QUERIES,
  MATHS_SECONDARY_ALL_QUERIES,
  type GroundTruthQuery,
} from './ground-truth-archive';
