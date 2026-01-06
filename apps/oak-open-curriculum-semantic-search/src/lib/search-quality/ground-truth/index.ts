/**
 * Comprehensive ground truth for search quality evaluation.
 *
 * **Phase-Aligned Architecture (2026-01-03)**:
 * Ground truths are organised by phase (primary/secondary) to align with
 * the curriculum structure and eliminate measurement artefacts.
 *
 * **Query types**:
 * - Curriculum concept queries: Test semantic understanding (stable)
 * - Content discovery queries: Test specific content findability (coupled to content)
 *
 * **Methodology**:
 * All lesson slugs verified against Oak API via MCP tools.
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

export type { GroundTruthQuery } from './types';

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
import { COOKING_ALL_QUERIES } from './cooking-nutrition';
import { DT_ALL_QUERIES } from './design-technology';
import { ENGLISH_ALL_QUERIES } from './english';
import { FRENCH_ALL_QUERIES } from './french';
import { GEOGRAPHY_ALL_QUERIES } from './geography';
import { GERMAN_ALL_QUERIES } from './german';
import { HISTORY_ALL_QUERIES } from './history';
import { ALL_MATHS_QUERIES } from './maths';
import { MUSIC_ALL_QUERIES } from './music';
import { PE_ALL_QUERIES } from './physical-education';
import { RE_ALL_QUERIES } from './religious-education';
import { SCIENCE_ALL_QUERIES } from './science';
import { SPANISH_ALL_QUERIES } from './spanish';
import type { GroundTruthQuery } from './types';

/**
 * All ground truth queries across all subjects.
 *
 * Total: 263 queries across 16 subjects
 */
export const ALL_GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...ALL_MATHS_QUERIES,
  ...ENGLISH_ALL_QUERIES,
  ...SCIENCE_ALL_QUERIES,
  ...HISTORY_ALL_QUERIES,
  ...GEOGRAPHY_ALL_QUERIES,
  ...RE_ALL_QUERIES,
  ...FRENCH_ALL_QUERIES,
  ...SPANISH_ALL_QUERIES,
  ...GERMAN_ALL_QUERIES,
  ...COMPUTING_ALL_QUERIES,
  ...ART_ALL_QUERIES,
  ...MUSIC_ALL_QUERIES,
  ...DT_ALL_QUERIES,
  ...PE_ALL_QUERIES,
  ...CITIZENSHIP_ALL_QUERIES,
  ...COOKING_ALL_QUERIES,
] as const;

// Diagnostic queries
export {
  DIAGNOSTIC_QUERIES,
  MULTI_CONCEPT_DIAGNOSTIC_QUERIES,
  SYNONYM_DIAGNOSTIC_QUERIES,
} from './diagnostic-queries';

// Maths exports
export {
  ALL_MATHS_QUERIES,
  MATHS_SECONDARY_ALL_QUERIES,
  MATHS_SECONDARY_HARD_QUERIES,
  MATHS_SECONDARY_STANDARD_QUERIES,
  ALGEBRA_QUERIES,
  EDGE_CASE_QUERIES,
  GEOMETRY_QUERIES,
  GRAPHS_QUERIES,
  HARD_QUERIES,
  NUMBER_QUERIES,
  STATISTICS_QUERIES,
  UNIT_ALL_GROUND_TRUTH_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type UnitGroundTruthQuery,
} from './maths';

// English exports
export {
  ENGLISH_ALL_QUERIES,
  ENGLISH_HARD_QUERIES,
  ENGLISH_STANDARD_QUERIES,
  ENGLISH_PRIMARY_ALL_QUERIES,
  ENGLISH_PRIMARY_HARD_QUERIES,
  ENGLISH_PRIMARY_STANDARD_QUERIES,
  ENGLISH_SECONDARY_ALL_QUERIES,
  ENGLISH_SECONDARY_HARD_QUERIES,
  ENGLISH_SECONDARY_STANDARD_QUERIES,
} from './english';

// Science exports
export { SCIENCE_ALL_QUERIES, SCIENCE_HARD_QUERIES, SCIENCE_STANDARD_QUERIES } from './science';

// History exports
export { HISTORY_ALL_QUERIES, HISTORY_HARD_QUERIES, HISTORY_STANDARD_QUERIES } from './history';

// Geography exports
export {
  GEOGRAPHY_ALL_QUERIES,
  GEOGRAPHY_HARD_QUERIES,
  GEOGRAPHY_STANDARD_QUERIES,
} from './geography';

// Religious Education exports
export { RE_ALL_QUERIES, RE_HARD_QUERIES, RE_STANDARD_QUERIES } from './religious-education';

// French exports
export { FRENCH_ALL_QUERIES, FRENCH_HARD_QUERIES, FRENCH_STANDARD_QUERIES } from './french';

// Spanish exports
export { SPANISH_ALL_QUERIES, SPANISH_HARD_QUERIES, SPANISH_STANDARD_QUERIES } from './spanish';

// German exports
export { GERMAN_ALL_QUERIES, GERMAN_HARD_QUERIES, GERMAN_STANDARD_QUERIES } from './german';

// Computing exports
export {
  COMPUTING_ALL_QUERIES,
  COMPUTING_HARD_QUERIES,
  COMPUTING_STANDARD_QUERIES,
} from './computing';

// Art exports
export { ART_ALL_QUERIES, ART_HARD_QUERIES, ART_STANDARD_QUERIES } from './art';

// Music exports
export { MUSIC_ALL_QUERIES, MUSIC_HARD_QUERIES, MUSIC_STANDARD_QUERIES } from './music';

// Design & Technology exports
export { DT_ALL_QUERIES, DT_HARD_QUERIES, DT_STANDARD_QUERIES } from './design-technology';

// Physical Education exports
export { PE_ALL_QUERIES, PE_HARD_QUERIES, PE_STANDARD_QUERIES } from './physical-education';

// Citizenship exports
export {
  CITIZENSHIP_ALL_QUERIES,
  CITIZENSHIP_HARD_QUERIES,
  CITIZENSHIP_STANDARD_QUERIES,
} from './citizenship';

// Cooking & Nutrition exports
export {
  COOKING_ALL_QUERIES,
  COOKING_HARD_QUERIES,
  COOKING_STANDARD_QUERIES,
} from './cooking-nutrition';
