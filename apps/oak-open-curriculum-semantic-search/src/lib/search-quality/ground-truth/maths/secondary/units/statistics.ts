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
  },
  {
    query: 'conditional probability',
    expectedRelevance: {
      'conditional-probability': 3,
    },
  },
  {
    query: 'histograms',
    expectedRelevance: {
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 3,
    },
  },
  {
    query: 'cumulative frequency',
    expectedRelevance: {
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 3,
    },
  },
  {
    query: 'scatter graphs',
    expectedRelevance: {
      'graphical-representations-of-data-scatter-graphs-and-time-series': 3,
    },
  },
  {
    query: 'sampling',
    expectedRelevance: {
      sampling: 3,
    },
  },
  {
    query: 'data comparison',
    expectedRelevance: {
      'comparisons-of-numerical-summaries-of-data': 3,
      'graphical-representations-of-data-scatter-graphs-and-time-series': 2,
      'graphical-representations-of-data-cumulative-frequency-and-histograms': 2,
    },
  },
] as const;
