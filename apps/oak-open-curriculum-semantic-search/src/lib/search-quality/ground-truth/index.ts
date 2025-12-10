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
 * @module search-quality/ground-truth
 */

export type { GroundTruthQuery } from './types';

import { ALGEBRA_QUERIES } from './algebra';
import { GEOMETRY_QUERIES } from './geometry';
import { NUMBER_QUERIES } from './number';
import { GRAPHS_QUERIES } from './graphs';
import { STATISTICS_QUERIES } from './statistics';
import { EDGE_CASE_QUERIES } from './edge-cases';
import type { GroundTruthQuery } from './types';

/**
 * All ground truth queries combined.
 *
 * Total: 38 queries covering all major KS4 Maths curriculum areas.
 */
export const GROUND_TRUTH_QUERIES: readonly GroundTruthQuery[] = [
  ...ALGEBRA_QUERIES,
  ...GEOMETRY_QUERIES,
  ...NUMBER_QUERIES,
  ...GRAPHS_QUERIES,
  ...STATISTICS_QUERIES,
  ...EDGE_CASE_QUERIES,
] as const;
