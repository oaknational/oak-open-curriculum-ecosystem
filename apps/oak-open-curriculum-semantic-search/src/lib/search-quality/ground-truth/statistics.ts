/**
 * Ground truth queries for Statistics & Probability topics.
 *
 */

import type { GroundTruthQuery } from './types';

export const STATISTICS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'probability',
    expectedRelevance: {
      'experimental-probability': 3,
      'experimental-vs-theoretical-probability': 3,
      'conditional-probability-in-a-tree-diagram': 3,
      'conditional-probability-in-a-two-way-table': 3,
      'conditional-probability-in-a-venn-diagram': 3,
      'comparing-multiple-representations-to-calculate-conditional-probabilities': 3,
      'checking-and-securing-calculating-probabilities-from-diagrams': 3,
      'checking-and-securing-calculating-probabilities-from-tables': 3,
      'frequency-trees': 3,
      'algebra-in-tree-and-venn-diagrams': 3,
      'probabilities-involving-algebra': 3,
      'problem-solving-with-conditional-probability': 3,
      combinations: 2,
      'set-notation': 2,
    },
  },
  {
    query: 'histograms',
    expectedRelevance: {
      'histograms-with-equal-bar-width': 3,
      'histograms-with-unequal-bar-width': 3,
      'moving-between-tables-and-histograms': 3,
      'summary-statistics-from-histograms': 3,
      'constructing-histograms-and-box-plots-using-technology': 3,
    },
  },
  {
    query: 'cumulative frequency',
    expectedRelevance: {
      'constructing-a-cumulative-frequency-graph': 3,
      'interpreting-a-cumulative-frequency-graph': 3,
      'constructing-box-plots': 3,
      'comparing-box-plots': 3,
      'interquartile-range': 3,
      'problem-solving-with-cumulative-frequency-and-histograms': 3,
    },
  },
  {
    query: 'scatter graphs',
    expectedRelevance: {
      'checking-understanding-of-scatter-graphs': 3,
      'checking-understanding-of-correlation': 3,
      'estimating-from-scatter-graphs': 3,
      'outliers-in-scatter-graphs': 3,
      'interpolation-versus-extrapolation': 3,
      'problem-solving-with-scatter-graphs-and-time-series': 3,
    },
  },
  {
    query: 'sampling',
    expectedRelevance: {
      'sampling-methods': 3,
      'stratified-sampling': 3,
      'sampling-limitations': 3,
      'capture-recapture-sampling-method': 3,
      'biased-questioning': 3,
      'data-collection': 3,
      'types-of-data': 3,
      'the-statistical-enquiry-cycle': 3,
      'problem-solving-with-sampling': 3,
    },
  },
] as const;
