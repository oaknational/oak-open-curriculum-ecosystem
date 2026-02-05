/**
 * Comprehensive ground truth for search quality evaluation.
 *
 * **Phase-Aligned Architecture (2026-01-11)**:
 * Ground truths are organised by phase (primary/secondary) to align with
 * the curriculum structure. Each subject-phase has exactly 4 queries,
 * one for each category: precise-topic, natural-expression, imprecise-input, cross-topic.
 *
 * **Total**: 120 queries (30 subject-phases × 4 categories)
 *
 * ## Ground Truth Registry
 *
 * The registry (`GROUND_TRUTH_ENTRIES`) is THE single source of truth for all
 * ground truth entries. Use the registry accessors for validation and benchmarking:
 *
 * - `getAllGroundTruthEntries()` - Iterate all entries
 * - `getGroundTruthEntry(subject, phase)` - Get specific entry
 * - `getEntriesForSubject(subject)` - Get all entries for a subject
 * - `getEntriesForPhase(phase)` - Get all entries for a phase
 *
 * @packageDocumentation
 */

export type {
  GroundTruthQuery,
  QueryCategory,
  GroundTruthQueryDefinition,
  ExpectedRelevance,
} from './types';
export { combineGroundTruth } from './types';

// Registry - THE single source of truth
export type { GroundTruthEntry, Phase } from './registry/index';
export {
  getAllGroundTruthEntries,
  getEntriesForPhase,
  getEntriesForSubject,
  getGroundTruthEntry,
  GROUND_TRUTH_ENTRIES,
} from './registry/index';

import { ART_ALL_QUERIES } from './art';
import { CITIZENSHIP_ALL_QUERIES } from './citizenship';
import { COMPUTING_ALL_QUERIES } from './computing';
import { COOKING_NUTRITION_ALL_QUERIES } from './cooking-nutrition';
import { DESIGN_TECHNOLOGY_ALL_QUERIES } from './design-technology';
import { ENGLISH_ALL_QUERIES } from './english';
import { FRENCH_ALL_QUERIES } from './french';
import { GEOGRAPHY_ALL_QUERIES } from './geography';
import { GERMAN_ALL_QUERIES } from './german';
import { HISTORY_ALL_QUERIES } from './history';
import { MATHS_ALL_QUERIES } from './maths';
import { MUSIC_ALL_QUERIES } from './music';
import { PHYSICAL_EDUCATION_ALL_QUERIES } from './physical-education';
import { RELIGIOUS_EDUCATION_ALL_QUERIES } from './religious-education';
import { SCIENCE_ALL_QUERIES } from './science';
import { SPANISH_ALL_QUERIES } from './spanish';
import type { GroundTruthQuery } from './types';

/**
 * All ground truth queries across all subjects.
 *
 * Total: 120 queries (30 subject-phases × 4 categories)
 */
export const ALL_GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_ALL_QUERIES,
  ...ENGLISH_ALL_QUERIES,
  ...SCIENCE_ALL_QUERIES,
  ...HISTORY_ALL_QUERIES,
  ...GEOGRAPHY_ALL_QUERIES,
  ...RELIGIOUS_EDUCATION_ALL_QUERIES,
  ...FRENCH_ALL_QUERIES,
  ...SPANISH_ALL_QUERIES,
  ...GERMAN_ALL_QUERIES,
  ...COMPUTING_ALL_QUERIES,
  ...ART_ALL_QUERIES,
  ...MUSIC_ALL_QUERIES,
  ...DESIGN_TECHNOLOGY_ALL_QUERIES,
  ...PHYSICAL_EDUCATION_ALL_QUERIES,
  ...CITIZENSHIP_ALL_QUERIES,
  ...COOKING_NUTRITION_ALL_QUERIES,
] as const;

// Diagnostic queries
export {
  DIAGNOSTIC_QUERIES,
  MULTI_CONCEPT_DIAGNOSTIC_QUERIES,
  SYNONYM_DIAGNOSTIC_QUERIES,
} from './diagnostic-queries';

// Subject exports
export { MATHS_ALL_QUERIES, MATHS_PRIMARY_ALL_QUERIES, MATHS_SECONDARY_ALL_QUERIES } from './maths';
export {
  ENGLISH_ALL_QUERIES,
  ENGLISH_PRIMARY_ALL_QUERIES,
  ENGLISH_SECONDARY_ALL_QUERIES,
} from './english';
export {
  SCIENCE_ALL_QUERIES,
  SCIENCE_PRIMARY_ALL_QUERIES,
  SCIENCE_SECONDARY_ALL_QUERIES,
} from './science';
export {
  HISTORY_ALL_QUERIES,
  HISTORY_PRIMARY_ALL_QUERIES,
  HISTORY_SECONDARY_ALL_QUERIES,
} from './history';
export {
  GEOGRAPHY_ALL_QUERIES,
  GEOGRAPHY_PRIMARY_ALL_QUERIES,
  GEOGRAPHY_SECONDARY_ALL_QUERIES,
} from './geography';
export {
  RELIGIOUS_EDUCATION_ALL_QUERIES,
  RELIGIOUS_EDUCATION_PRIMARY_ALL_QUERIES,
  RELIGIOUS_EDUCATION_SECONDARY_ALL_QUERIES,
} from './religious-education';
export {
  FRENCH_ALL_QUERIES,
  FRENCH_PRIMARY_ALL_QUERIES,
  FRENCH_SECONDARY_ALL_QUERIES,
} from './french';
export {
  SPANISH_ALL_QUERIES,
  SPANISH_PRIMARY_ALL_QUERIES,
  SPANISH_SECONDARY_ALL_QUERIES,
} from './spanish';
export { GERMAN_ALL_QUERIES, GERMAN_SECONDARY_ALL_QUERIES } from './german';
export {
  COMPUTING_ALL_QUERIES,
  COMPUTING_PRIMARY_ALL_QUERIES,
  COMPUTING_SECONDARY_ALL_QUERIES,
} from './computing';
export { ART_ALL_QUERIES, ART_PRIMARY_ALL_QUERIES, ART_SECONDARY_ALL_QUERIES } from './art';
export { MUSIC_ALL_QUERIES, MUSIC_PRIMARY_ALL_QUERIES, MUSIC_SECONDARY_ALL_QUERIES } from './music';
export {
  DESIGN_TECHNOLOGY_ALL_QUERIES,
  DESIGN_TECHNOLOGY_PRIMARY_ALL_QUERIES,
  DESIGN_TECHNOLOGY_SECONDARY_ALL_QUERIES,
} from './design-technology';
export {
  PHYSICAL_EDUCATION_ALL_QUERIES,
  PHYSICAL_EDUCATION_PRIMARY_ALL_QUERIES,
  PHYSICAL_EDUCATION_SECONDARY_ALL_QUERIES,
} from './physical-education';
export { CITIZENSHIP_ALL_QUERIES, CITIZENSHIP_SECONDARY_ALL_QUERIES } from './citizenship';
export {
  COOKING_NUTRITION_ALL_QUERIES,
  COOKING_NUTRITION_PRIMARY_ALL_QUERIES,
  COOKING_NUTRITION_SECONDARY_ALL_QUERIES,
} from './cooking-nutrition';
