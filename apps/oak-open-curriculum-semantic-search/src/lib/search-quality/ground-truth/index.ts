/**
 * Comprehensive ground truth for KS4 Maths search quality evaluation.
 *
 * Ground truth is split by topic area:
 * - Algebra: quadratics, simultaneous equations, factorising, etc.
 * - Geometry: Pythagoras, trigonometry, circle theorems, vectors, etc.
 * - Number: indices, surds, percentages, ratio, etc.
 * - Graphs: linear, quadratic, transformations, real-life
 * - Statistics: probability, histograms, cumulative frequency, etc.
 * - Edge cases: natural language queries, misspellings
 *
 * **Methodology (2025-12-10)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-units` for unit structure
 * - `get-key-stages-subject-lessons` for lesson slugs
 * - `get-lessons-summary` for lesson details
 *
 * @packageDocumentation
 */

export type { GroundTruthQuery } from './types';

import { ALGEBRA_QUERIES } from './algebra';
import { EDGE_CASE_QUERIES } from './edge-cases';
import { GEOMETRY_QUERIES } from './geometry';
import { GRAPHS_QUERIES } from './graphs';
import { HARD_QUERIES } from './hard-queries';
import { NUMBER_QUERIES } from './number';
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
 * All ground truth queries (standard + hard).
 *
 * Total: 55 queries
 */
export const ALL_GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...GROUND_TRUTH_QUERIES,
  ...HARD_GROUND_TRUTH_QUERIES,
] as const;
