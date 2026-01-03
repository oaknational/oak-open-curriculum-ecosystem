/**
 * Comprehensive ground truth for search quality evaluation.
 *
 * **Subjects covered (17 total):**
 * - Maths (KS4): Algebra, Geometry, Number, Graphs, Statistics
 * - English (KS1-4): Shakespeare, poetry, fiction, non-fiction, writing
 * - Science (KS2-3): Biology, Chemistry, Physics
 * - History (KS2-3): Medieval, Modern, Ancient
 * - Geography (KS3): Physical geography
 * - Religious Education (KS3): World religions, ethics
 * - French (KS3): Grammar, vocabulary
 * - Spanish (KS3): Grammar, vocabulary
 * - German (KS3): Grammar, vocabulary
 * - Computing (KS3): Programming, networks, data
 * - Art (KS3): Movements, techniques, identity
 * - Music (KS3): Performance, composition
 * - Design & Technology (KS3): Materials, manufacturing, sustainability
 * - Physical Education (KS3): Athletics, games, dance
 * - Citizenship (KS3): Democracy, rights, community
 * - Cooking & Nutrition (KS2): Healthy eating, recipes
 * - RSHE/PSHE: DEFERRED (awaiting bulk data)
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-units` for unit structure
 * - `get-key-stages-subject-lessons` for lesson slugs
 * - `get-lessons-summary` for lesson details
 *
 * @packageDocumentation
 */

export type { GroundTruthQuery } from './types';

import { ALGEBRA_QUERIES } from './algebra';
import { ART_ALL_QUERIES } from './art';
import { CITIZENSHIP_ALL_QUERIES } from './citizenship';
import { COMPUTING_ALL_QUERIES } from './computing';
import { COOKING_ALL_QUERIES } from './cooking-nutrition';
import { DT_ALL_QUERIES } from './design-technology';
import { EDGE_CASE_QUERIES } from './edge-cases';
import { ENGLISH_ALL_QUERIES } from './english';
import { FRENCH_ALL_QUERIES } from './french';
import { GEOGRAPHY_ALL_QUERIES } from './geography';
import { GEOMETRY_QUERIES } from './geometry';
import { GERMAN_ALL_QUERIES } from './german';
import { GRAPHS_QUERIES } from './graphs';
import { HARD_QUERIES } from './hard-queries';
import { HISTORY_ALL_QUERIES } from './history';
import { MUSIC_ALL_QUERIES } from './music';
import { NUMBER_QUERIES } from './number';
import { PE_ALL_QUERIES } from './physical-education';
import { RE_ALL_QUERIES } from './religious-education';
import { SCIENCE_ALL_QUERIES } from './science';
import { SPANISH_ALL_QUERIES } from './spanish';
import { STATISTICS_QUERIES } from './statistics';
import type { GroundTruthQuery } from './types';

/**
 * Standard ground truth queries (topic-name based).
 *
 * Total: 40 queries covering all major KS4 Maths curriculum areas.
 */
export const GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...ALGEBRA_QUERIES,
  ...GEOMETRY_QUERIES,
  ...NUMBER_QUERIES,
  ...GRAPHS_QUERIES,
  ...STATISTICS_QUERIES,
  ...EDGE_CASE_QUERIES,
] as const;

/**
 * Hard ground truth queries (naturalistic, misspellings, multi-concept).
 *
 * These queries are designed to challenge the search system and prove
 * the value of the four-retriever hybrid architecture.
 *
 * Total: 15 queries
 */
export const HARD_GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES;

/**
 * Diagnostic queries for fine-grained failure mode analysis.
 *
 * Purpose: Understand WHY synonym and multi-concept queries fail.
 * - Synonym: single-word vs phrase vs position vs density
 * - Multi-concept: AND vs OR, concept density, method recognition
 *
 * Total: 18 queries (9 synonym + 9 multi-concept)
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` B.5
 */
export {
  DIAGNOSTIC_QUERIES,
  SYNONYM_DIAGNOSTIC_QUERIES,
  MULTI_CONCEPT_DIAGNOSTIC_QUERIES,
} from './diagnostic-queries';

/**
 * All Maths ground truth queries (standard + hard).
 *
 * Total: 55 queries (40 standard + 15 hard)
 */
export const ALL_MATHS_GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...GROUND_TRUTH_QUERIES,
  ...HARD_GROUND_TRUTH_QUERIES,
] as const;

/**
 * All ground truth queries across all subjects.
 *
 * Current coverage (2026-01-03):
 * - Maths KS4: 55 queries (40 standard + 15 hard)
 * - English KS1-4: 66 queries (50 standard + 16 hard)
 * - Science KS2-3: 35 queries (26 standard + 9 hard)
 * - History KS2-3: 16 queries (11 standard + 5 hard)
 * - Geography KS3: 9 queries (5 standard + 4 hard)
 * - Religious Education KS3: 7 queries (4 standard + 3 hard)
 * - French KS3: 6 queries (3 standard + 3 hard)
 * - Spanish KS3: 6 queries (3 standard + 3 hard)
 * - German KS3: 6 queries (3 standard + 3 hard)
 * - Computing KS3: 9 queries (6 standard + 3 hard)
 * - Art KS3: 9 queries (6 standard + 3 hard)
 * - Music KS3: 9 queries (6 standard + 3 hard)
 * - Design & Technology KS3: 9 queries (6 standard + 3 hard)
 * - Physical Education KS3: 9 queries (6 standard + 3 hard)
 * - Citizenship KS3: 6 queries (4 standard + 2 hard)
 * - Cooking & Nutrition KS2: 6 queries (4 standard + 2 hard)
 *
 * Total: 263 queries across 16 subjects (RSHE/PSHE deferred)
 */
export const ALL_GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...ALL_MATHS_GROUND_TRUTH_QUERIES,
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

// Re-export English ground truth
export { ENGLISH_ALL_QUERIES, ENGLISH_HARD_QUERIES, ENGLISH_STANDARD_QUERIES } from './english';

// Re-export Science ground truth
export { SCIENCE_ALL_QUERIES, SCIENCE_HARD_QUERIES, SCIENCE_STANDARD_QUERIES } from './science';

// Re-export History ground truth
export { HISTORY_ALL_QUERIES, HISTORY_HARD_QUERIES, HISTORY_STANDARD_QUERIES } from './history';

// Re-export Geography ground truth
export {
  GEOGRAPHY_ALL_QUERIES,
  GEOGRAPHY_HARD_QUERIES,
  GEOGRAPHY_STANDARD_QUERIES,
} from './geography';

// Re-export Religious Education ground truth
export { RE_ALL_QUERIES, RE_HARD_QUERIES, RE_STANDARD_QUERIES } from './religious-education';

// Re-export French ground truth
export { FRENCH_ALL_QUERIES, FRENCH_HARD_QUERIES, FRENCH_STANDARD_QUERIES } from './french';

// Re-export Spanish ground truth
export { SPANISH_ALL_QUERIES, SPANISH_HARD_QUERIES, SPANISH_STANDARD_QUERIES } from './spanish';

// Re-export German ground truth
export { GERMAN_ALL_QUERIES, GERMAN_HARD_QUERIES, GERMAN_STANDARD_QUERIES } from './german';

// Re-export Computing ground truth
export {
  COMPUTING_ALL_QUERIES,
  COMPUTING_HARD_QUERIES,
  COMPUTING_STANDARD_QUERIES,
} from './computing';

// Re-export Art ground truth
export { ART_ALL_QUERIES, ART_HARD_QUERIES, ART_STANDARD_QUERIES } from './art';

// Re-export Music ground truth
export { MUSIC_ALL_QUERIES, MUSIC_HARD_QUERIES, MUSIC_STANDARD_QUERIES } from './music';

// Re-export Design & Technology ground truth
export { DT_ALL_QUERIES, DT_HARD_QUERIES, DT_STANDARD_QUERIES } from './design-technology';

// Re-export Physical Education ground truth
export { PE_ALL_QUERIES, PE_HARD_QUERIES, PE_STANDARD_QUERIES } from './physical-education';

// Re-export Citizenship ground truth
export {
  CITIZENSHIP_ALL_QUERIES,
  CITIZENSHIP_HARD_QUERIES,
  CITIZENSHIP_STANDARD_QUERIES,
} from './citizenship';

// Re-export Cooking & Nutrition ground truth
export {
  COOKING_ALL_QUERIES,
  COOKING_HARD_QUERIES,
  COOKING_STANDARD_QUERIES,
} from './cooking-nutrition';
