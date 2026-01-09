/**
 * Ground truth queries for Graphs topics (KS3-4 Secondary).
 *
 * Covers linear graphs, quadratic graphs, transformations, and real-life graphs.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Graphs ground truth queries for Secondary Maths.
 *
 * Topics: linear graphs, quadratic graphs, transformations, distance-time graphs.
 */
export const GRAPHS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'drawing linear graphs y mx c',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of linear graphs content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-drawing-linear-graphs': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-the-graph': 3,
      'checking-and-securing-understanding-of-finding-the-equation-of-the-line-from-coordinates': 2,
    },
  },
  {
    query: 'parallel perpendicular lines gradient',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of parallel and perpendicular lines content using curriculum terminology',
    expectedRelevance: {
      'parallel-linear-graphs': 3,
      'perpendicular-linear-graphs': 3,
      'identifying-perpendicular-linear-graphs': 2,
    },
  },
  {
    query: 'quadratic graphs parabola features',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of quadratic graphs content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-drawing-quadratic-graphs': 3,
      'key-features-of-a-quadratic-graph': 3,
      'solving-quadratic-inequalities-in-one-variable-graphically': 2,
    },
  },
  {
    query: 'graph transformations f of x',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of graph transformations content using curriculum terminology',
    expectedRelevance: {
      'transforming-graphs-y-equals-f-x-plus-a': 3,
      'transforming-graphs-y-equals-af-x': 3,
      'transforming-graphs-combinations-of-transformations': 2,
    },
  },
  {
    query: 'distance time graphs speed',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of distance-time graphs content using curriculum terminology',
    expectedRelevance: {
      'distance-time-graphs': 3,
      'checking-and-securing-understanding-of-drawing-distance-time-graphs': 3,
      'non-linear-distance-time-graphs': 2,
    },
  },
  {
    query: 'speed time graphs acceleration',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of speed-time graphs content using curriculum terminology',
    expectedRelevance: {
      'speed-time-graphs': 3,
      'calculating-journeys-from-linear-speed-time-graphs': 3,
      'estimating-journeys-from-non-linear-graphs': 2,
    },
  },
] as const;
