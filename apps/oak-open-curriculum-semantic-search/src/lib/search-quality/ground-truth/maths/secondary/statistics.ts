/**
 * Ground truth queries for Statistics and Probability topics (KS3-4 Secondary).
 *
 * Covers probability, histograms, cumulative frequency, scatter graphs, and sampling.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Statistics ground truth queries for Secondary Maths.
 *
 * Topics: probability, histograms, cumulative frequency, scatter graphs, sampling.
 */
export const STATISTICS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'conditional probability tree diagrams',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of conditional probability content using curriculum terminology',
    expectedRelevance: {
      'conditional-probability-in-a-tree-diagram': 3,
      'frequency-trees': 3,
      'algebra-in-tree-and-venn-diagrams': 2,
    },
  },
  {
    query: 'probability Venn diagrams two way tables',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of probability representations content using curriculum terminology',
    expectedRelevance: {
      'conditional-probability-in-a-venn-diagram': 3,
      'conditional-probability-in-a-two-way-table': 3,
      'comparing-multiple-representations-to-calculate-conditional-probabilities': 2,
    },
  },
  {
    query: 'experimental theoretical probability',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of experimental probability content using curriculum terminology',
    expectedRelevance: {
      'experimental-probability': 3,
      'experimental-vs-theoretical-probability': 3,
      'checking-and-securing-calculating-probabilities-from-diagrams': 2,
    },
  },
  {
    query: 'histograms frequency density unequal',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of histogram content using curriculum terminology',
    expectedRelevance: {
      'histograms-with-unequal-bar-width': 3,
      'histograms-with-equal-bar-width': 3,
      'moving-between-tables-and-histograms': 2,
    },
  },
  {
    query: 'cumulative frequency box plots median',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of cumulative frequency content using curriculum terminology',
    expectedRelevance: {
      'constructing-a-cumulative-frequency-graph': 3,
      'constructing-box-plots': 3,
      'interquartile-range': 2,
    },
  },
  {
    query: 'scatter graphs correlation line of best fit',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of scatter graphs content using curriculum terminology',
    expectedRelevance: {
      'checking-understanding-of-scatter-graphs': 3,
      'checking-understanding-of-correlation': 3,
      'estimating-from-scatter-graphs': 2,
    },
  },
  {
    query: 'stratified sampling methods statistics',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of sampling methods content using curriculum terminology',
    expectedRelevance: {
      'stratified-sampling': 3,
      'sampling-methods': 3,
      'sampling-limitations': 2,
    },
  },
] as const;
