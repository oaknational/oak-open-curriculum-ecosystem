/**
 * Comprehensive ground truth for KS4 Maths unit search quality evaluation.
 *
 * Ground truth is split by topic area:
 * - Algebra: quadratics, simultaneous equations, factorising, iteration, etc.
 * - Geometry: Pythagoras, trigonometry, circle theorems, vectors, bearings, etc.
 * - Number: percentages, ratio, surds, indices, standard form, bounds, etc.
 * - Graphs: linear, non-linear, transformations, real-life, etc.
 * - Statistics: probability, histograms, scatter graphs, sampling, etc.
 *
 * **Methodology** (2025-12-11):
 * Unit slugs verified against Oak API Maths KS4 units via MCP tools.
 * Expected relevance scores:
 * - 3: Highly relevant (primary topic match)
 * - 2: Relevant (related topic)
 * - 1: Marginally relevant
 * - 0: Not relevant (unlisted)
 *
 * @module search-quality/ground-truth/units
 */

export type { UnitGroundTruthQuery } from './types';

import { UNIT_ALGEBRA_QUERIES } from './algebra';
import { UNIT_GEOMETRY_QUERIES } from './geometry';
import { UNIT_GRAPHS_QUERIES } from './graphs';
import { UNIT_NUMBER_QUERIES } from './number';
import { UNIT_STATISTICS_QUERIES } from './statistics';
import type { UnitGroundTruthQuery } from './types';

/**
 * All unit ground truth queries combined.
 *
 * Total: 43 queries covering all major KS4 Maths curriculum areas.
 */
export const UNIT_GROUND_TRUTH_QUERIES: readonly UnitGroundTruthQuery[] = [
  ...UNIT_ALGEBRA_QUERIES,
  ...UNIT_GEOMETRY_QUERIES,
  ...UNIT_GRAPHS_QUERIES,
  ...UNIT_NUMBER_QUERIES,
  ...UNIT_STATISTICS_QUERIES,
] as const;
