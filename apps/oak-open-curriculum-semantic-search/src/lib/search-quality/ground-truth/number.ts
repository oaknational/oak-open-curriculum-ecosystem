/**
 * Ground truth queries for Number topics.
 *
 */

import type { GroundTruthQuery } from './types';

export const NUMBER_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'indices',
    expectedRelevance: {
      'the-laws-of-indices-multiplication': 3,
      'the-laws-of-indices-division': 3,
      'the-laws-of-indices-raising-a-power-to-a-power': 3,
      'the-laws-of-indices-negative-and-zero-exponents': 3,
      'the-laws-of-indices-fractional-exponents': 3,
      'checking-and-securing-understanding-of-roots-and-integer-indices': 3,
      'problem-solving-with-the-laws-of-indices': 3,
      'advanced-problem-solving-with-the-laws-of-indices': 3,
    },
  },
  {
    query: 'surds',
    expectedRelevance: {
      'simplifying-surds': 3,
      'addition-with-surds': 3,
      'multiplication-of-surds': 3,
      'identifying-square-factors-to-support-simplifying-surds': 3,
      'applying-the-underlying-structure-of-multiplication-and-division-of-surds': 3,
      'rationalising-a-single-term-denominator': 3,
      'rationalising-a-two-term-denominator': 3,
      'the-distributive-law-with-surds': 3,
      'solving-equations-with-surds': 3,
      'problem-solving-with-surds': 3,
    },
  },
  {
    query: 'standard form',
    expectedRelevance: {
      'checking-and-securing-understanding-of-writing-large-numbers-in-standard-form': 3,
      'checking-and-securing-understanding-of-writing-small-numbers-in-standard-form': 3,
      'adding-numbers-in-standard-form': 3,
      'subtracting-numbers-in-standard-form': 3,
      'multiplying-numbers-in-standard-form': 3,
      'dividing-numbers-in-standard-form': 3,
      'problem-solving-with-standard-form-calculations': 3,
    },
  },
  {
    query: 'percentages',
    expectedRelevance: {
      'checking-and-securing-understanding-of-finding-a-percentage': 3,
      'checking-and-securing-understanding-of-percentage-increase': 3,
      'checking-and-securing-understanding-of-percentage-decrease': 3,
      'percentage-profit-and-loss': 3,
      'simple-interest-calculations': 3,
      'simple-and-compound-interest': 3,
      'compound-interest-calculations': 3,
      'calculating-compound-interest-rates': 3,
      'problem-solving-with-percentages': 3,
    },
  },
  {
    query: 'ratio',
    expectedRelevance: {
      'checking-and-securing-understanding-of-equivalent-ratios': 3,
      'checking-and-securing-understanding-of-simplifying-and-unitising-ratios': 3,
      'checking-and-securing-understanding-of-sharing-in-a-ratio': 3,
      'checking-and-securing-understanding-of-real-world-ratios': 3,
      'combining-ratios': 3,
      'changing-ratios': 3,
      'algebraic-ratios': 3,
      'writing-equations-from-ratios': 3,
      'problem-solving-with-ratios': 3,
    },
  },
  {
    query: 'proportion',
    expectedRelevance: {
      'abstract-direct-proportion': 3,
      'abstract-inverse-proportion': 3,
      'checking-and-securing-understanding-of-direct-proportion-graphs': 3,
      'checking-and-securing-understanding-of-inverse-proportion-graphs': 3,
      'finding-the-constant-of-proportionality-for-direct-proportion': 3,
      'finding-the-constant-of-proportionality-for-inverse-proportion': 3,
      'proportion-modelled-algebraically': 3,
      'problem-solving-with-direct-and-inverse-proportion': 3,
    },
  },
  {
    query: 'bounds',
    expectedRelevance: {
      'upper-and-lower-bounds': 3,
      'upper-and-lower-bounds-in-additive-calculations': 3,
      'upper-and-lower-bounds-in-multiplicative-calculations': 3,
      'using-upper-and-lower-bounds-practically': 3,
      'checking-and-securing-understanding-of-estimating-through-rounding': 2,
      'problem-solving-with-rounding-estimation-and-bounds': 3,
    },
  },
  {
    query: 'compound measures',
    expectedRelevance: {
      'compound-measures-for-speed': 3,
      'compound-measures-for-density': 3,
      'compound-measures-for-pressure': 3,
      'combining-speeds': 3,
      'combining-densities': 3,
      'converting-between-metric-speed-measures': 3,
      'converting-between-metric-and-imperial-speed-measures': 3,
      'problem-solving-with-compound-measures': 3,
    },
  },
] as const;
