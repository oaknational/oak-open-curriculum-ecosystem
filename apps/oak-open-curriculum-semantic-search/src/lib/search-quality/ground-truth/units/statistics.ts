/**
 * Ground truth queries for Statistics & Probability unit topics.
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 */

import type { UnitGroundTruthQuery } from './types';

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
