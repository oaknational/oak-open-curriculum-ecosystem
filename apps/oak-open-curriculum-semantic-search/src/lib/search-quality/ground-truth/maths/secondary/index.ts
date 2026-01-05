/**
 * Secondary Maths ground truth queries for search quality evaluation.
 *
 * Aggregates all KS3-4 Maths ground truths across topic areas:
 * - Algebra: quadratics, simultaneous equations, factorising, sequences, functions
 * - Geometry: Pythagoras, trigonometry, circle theorems, vectors, bearings
 * - Number: indices, surds, standard form, percentages, ratio, proportion
 * - Graphs: linear, quadratic, transformations, distance-time
 * - Statistics: probability, histograms, cumulative frequency, scatter graphs
 *
 * @packageDocumentation
 */

import { ALGEBRA_QUERIES } from './algebra';
import { EDGE_CASE_QUERIES } from './edge-cases';
import { GEOMETRY_QUERIES } from './geometry';
import { GRAPHS_QUERIES } from './graphs';
import { HARD_QUERIES } from './hard-queries';
import { NUMBER_QUERIES } from './number';
import { STATISTICS_QUERIES } from './statistics';
import type { GroundTruthQuery } from '../../types';

// Re-export unit ground truths
export {
  UNIT_ALL_GROUND_TRUTH_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
  type UnitGroundTruthQuery,
} from './units';

/**
 * Standard lesson ground truth queries for Secondary Maths (topic-name based).
 *
 * Total: 40 queries covering all major KS3-4 Maths curriculum areas.
 */
export const MATHS_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  ...ALGEBRA_QUERIES,
  ...GEOMETRY_QUERIES,
  ...GRAPHS_QUERIES,
  ...NUMBER_QUERIES,
  ...STATISTICS_QUERIES,
  ...EDGE_CASE_QUERIES,
] as const;

/**
 * Hard lesson ground truth queries for Secondary Maths.
 *
 * These queries challenge the search system with naturalistic phrasing,
 * misspellings, synonyms, multi-concept queries, and colloquial language.
 *
 * Total: 15 queries
 */
export const MATHS_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = HARD_QUERIES;

/**
 * All lesson ground truth queries for Secondary Maths (standard + hard).
 *
 * Total: 55 queries
 */
export const MATHS_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...MATHS_SECONDARY_STANDARD_QUERIES,
  ...MATHS_SECONDARY_HARD_QUERIES,
] as const;

// Re-export individual topic arrays for granular access
export { ALGEBRA_QUERIES } from './algebra';
export { GEOMETRY_QUERIES } from './geometry';
export { GRAPHS_QUERIES } from './graphs';
export { NUMBER_QUERIES } from './number';
export { STATISTICS_QUERIES } from './statistics';
export { HARD_QUERIES } from './hard-queries';
export { EDGE_CASE_QUERIES } from './edge-cases';
