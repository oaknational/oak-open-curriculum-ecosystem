/**
 * Ground truth queries for Graphs unit topics (Secondary Maths).
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
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
    category: 'precise-topic',
    description: 'Tests retrieval of linear graphs unit using curriculum terminology',
  },
  {
    query: 'straight line graphs',
    expectedRelevance: {
      'linear-graphs': 3,
    },
    category: 'natural-expression',
    description: 'Tests vocabulary bridging from straight line to linear graphs curriculum term',
  },
  {
    query: 'quadratic graphs',
    expectedRelevance: {
      'non-linear-graphs': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of non-linear graphs unit using curriculum terminology',
  },
  {
    query: 'graph transformations',
    expectedRelevance: {
      'transformations-of-graphs': 3,
      'non-linear-graphs': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of graph transformations unit using curriculum terminology',
  },
  {
    query: 'real life graphs',
    expectedRelevance: {
      'real-life-graphs': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of real-life graphs unit using curriculum terminology',
  },
] as const;
