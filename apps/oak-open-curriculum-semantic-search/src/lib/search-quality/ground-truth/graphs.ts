/**
 * Ground truth queries for Graphs topics.
 *
 * @module search-quality/ground-truth/graphs
 */

import type { GroundTruthQuery } from './types';

export const GRAPHS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'linear graphs',
    expectedRelevance: {
      'checking-and-securing-understanding-of-drawing-linear-graphs': 3,
      'checking-and-securing-understanding-of-drawing-vertical-and-horizontal-graphs': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-coordinates': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-the-graph': 3,
      'parallel-linear-graphs': 3,
      'perpendicular-linear-graphs': 3,
      'identifying-perpendicular-linear-graphs': 3,
      'parallel-and-perpendicular-lines-on-coordinate-axes': 3,
      'problem-solving-with-linear-graphs': 3,
      'advanced-problem-solving-with-linear-graphs': 3,
    },
  },
  {
    query: 'quadratic graphs',
    expectedRelevance: {
      'checking-and-securing-understanding-of-drawing-quadratic-graphs': 3,
      'key-features-of-a-quadratic-graph': 3,
      'solving-quadratic-inequalities-in-one-variable-graphically': 2,
    },
  },
  {
    query: 'graph transformations',
    expectedRelevance: {
      'transforming-graphs-y-equals-f-x-plus-a': 3,
      'transforming-graphs-y-equals-f-x-plus-a-fg854': 3,
      'transforming-graphs-y-equals-af-x': 3,
      'transforming-graphs-y-equals-f-ax': 3,
      'transforming-graphs-y-equals-f-x': 3,
      'transforming-graphs-y-equals-f-x-fb856': 3,
      'transforming-graphs-combinations-of-transformations': 3,
      'problem-solving-with-graph-transformations': 3,
    },
  },
  {
    query: 'distance time graphs',
    expectedRelevance: {
      'distance-time-graphs': 3,
      'non-linear-distance-time-graphs': 3,
      'checking-and-securing-understanding-of-drawing-distance-time-graphs': 3,
      'speed-time-graphs': 3,
      'calculating-journeys-from-linear-speed-time-graphs': 3,
      'estimating-journeys-from-non-linear-graphs': 3,
    },
  },
] as const;
