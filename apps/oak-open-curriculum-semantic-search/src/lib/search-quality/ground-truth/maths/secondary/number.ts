/**
 * Ground truth queries for Number topics (KS3-4 Secondary).
 *
 * Covers indices, surds, standard form, percentages, ratio, and proportion.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Number ground truth queries for Secondary Maths.
 *
 * Topics: indices, surds, standard form, percentages, ratio, proportion, bounds.
 */
export const NUMBER_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'laws of indices multiplication division',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of index laws content using curriculum terminology',
    expectedRelevance: {
      'the-laws-of-indices-multiplication': 3,
      'the-laws-of-indices-division': 3,
      'the-laws-of-indices-raising-a-power-to-a-power': 2,
    },
  },
  {
    query: 'negative and fractional indices',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of advanced indices content using curriculum terminology',
    expectedRelevance: {
      'the-laws-of-indices-negative-and-zero-exponents': 3,
      'the-laws-of-indices-fractional-exponents': 3,
      'checking-and-securing-understanding-of-roots-and-integer-indices': 2,
    },
  },
  {
    query: 'simplifying surds square roots',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of surds simplification content using curriculum terminology',
    expectedRelevance: {
      'simplifying-surds': 3,
      'identifying-square-factors-to-support-simplifying-surds': 3,
      'addition-with-surds': 2,
    },
  },
  {
    query: 'rationalising the denominator surds',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of rationalising denominators content using curriculum terminology',
    expectedRelevance: {
      'rationalising-a-single-term-denominator': 3,
      'rationalising-a-two-term-denominator': 3,
      'multiplication-of-surds': 2,
    },
  },
  {
    query: 'standard form large small numbers',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of standard form content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-writing-large-numbers-in-standard-form': 3,
      'checking-and-securing-understanding-of-writing-small-numbers-in-standard-form': 3,
      'adding-numbers-in-standard-form': 2,
    },
  },
  {
    query: 'compound interest percentage increase',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of compound interest content using curriculum terminology',
    expectedRelevance: {
      'compound-interest-calculations': 3,
      'simple-and-compound-interest': 3,
      'checking-and-securing-understanding-of-percentage-increase': 2,
    },
  },
  {
    query: 'sharing in a ratio problems',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of ratio sharing content using curriculum terminology',
    expectedRelevance: {
      'checking-and-securing-understanding-of-sharing-in-a-ratio': 3,
      'problem-solving-with-ratios': 3,
      'combining-ratios': 2,
    },
  },
  {
    query: 'direct and inverse proportion',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of proportion content using curriculum terminology',
    expectedRelevance: {
      'abstract-direct-proportion': 3,
      'abstract-inverse-proportion': 3,
      'problem-solving-with-direct-and-inverse-proportion': 2,
    },
  },
  {
    query: 'upper and lower bounds calculations',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of bounds content using curriculum terminology',
    expectedRelevance: {
      'upper-and-lower-bounds': 3,
      'upper-and-lower-bounds-in-multiplicative-calculations': 3,
      'upper-and-lower-bounds-in-additive-calculations': 2,
    },
  },
  {
    query: 'speed distance time compound measures',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of speed compound measures content using curriculum terminology',
    expectedRelevance: {
      'compound-measures-for-speed': 3,
      'combining-speeds': 3,
      'converting-between-metric-speed-measures': 2,
    },
  },
  {
    query: 'density mass volume compound measures',
    category: 'precise-topic',
    priority: 'medium',
    description:
      'Tests retrieval of density compound measures content using curriculum terminology',
    expectedRelevance: {
      'compound-measures-for-density': 3,
      'combining-densities': 3,
      'compound-measures-for-pressure': 2,
    },
  },
] as const;
