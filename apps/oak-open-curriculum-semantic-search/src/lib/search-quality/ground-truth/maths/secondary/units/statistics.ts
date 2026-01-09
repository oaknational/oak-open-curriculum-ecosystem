/**
 * Ground truth queries for Statistics and Probability unit topics (Secondary Maths).
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 * @packageDocumentation
 */

import type { UnitGroundTruthQuery } from './types';

/**
 * Statistics unit ground truth queries for Secondary Maths.
 */
export const UNIT_STATISTICS_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'probability',
    expectedRelevance: {
      'conditional-probability': 3,
      sampling: 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of probability unit using curriculum terminology',
    priority: 'high',
  },
  {
    query: 'conditional probability',
    expectedRelevance: {
      'conditional-probability': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of conditional probability unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'histograms',
    expectedRelevance: {
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of histograms unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'cumulative frequency',
    expectedRelevance: {
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of cumulative frequency unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'scatter graphs',
    expectedRelevance: {
      'graphical-representations-of-data-scatter-graphs-and-time-series': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of scatter graphs unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'sampling',
    expectedRelevance: {
      sampling: 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of sampling unit using curriculum terminology',
    priority: 'medium',
  },
  {
    query: 'data comparison',
    expectedRelevance: {
      'comparisons-of-numerical-summaries-of-data': 3,
      'graphical-representations-of-data-scatter-graphs-and-time-series': 2,
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 2,
    },
    category: 'natural-expression',
    description:
      'Tests vocabulary bridging from data comparison to numerical summaries curriculum term',
    priority: 'medium',
  },
] as const;
