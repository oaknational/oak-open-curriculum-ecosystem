/**
 * Ground truth queries for Graphs unit topics (Secondary Maths).
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 * @packageDocumentation
 */

import type { UnitGroundTruthQuery } from './types';

/**
 * Graphs unit ground truth queries for Secondary Maths.
 */
export const UNIT_GRAPHS_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'linear graphs',
    expectedRelevance: {
      'linear-graphs': 3,
      'real-life-graphs': 2,
    },
  },
  {
    query: 'straight line graphs',
    expectedRelevance: {
      'linear-graphs': 3,
    },
  },
  {
    query: 'quadratic graphs',
    expectedRelevance: {
      'non-linear-graphs': 3,
    },
  },
  {
    query: 'graph transformations',
    expectedRelevance: {
      'transformations-of-graphs': 3,
      'non-linear-graphs': 2,
    },
  },
  {
    query: 'real life graphs',
    expectedRelevance: {
      'real-life-graphs': 3,
    },
  },
] as const;
