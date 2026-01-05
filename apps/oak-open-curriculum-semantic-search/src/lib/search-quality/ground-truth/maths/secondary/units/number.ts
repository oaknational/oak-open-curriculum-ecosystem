/**
 * Ground truth queries for Number unit topics (Secondary Maths).
 *
 * Unit slugs verified against Oak API Maths KS4 units (2025-12-11).
 *
 * @packageDocumentation
 */

import type { UnitGroundTruthQuery } from './types';

/**
 * Number unit ground truth queries for Secondary Maths.
 */
export const UNIT_NUMBER_QUERIES: readonly UnitGroundTruthQuery[] = [
  {
    query: 'percentages',
    expectedRelevance: {
      percentages: 3,
    },
  },
  {
    query: 'ratio',
    expectedRelevance: {
      ratio: 3,
      'direct-and-inverse-proportion': 2,
    },
  },
  {
    query: 'ratio and proportion',
    expectedRelevance: {
      ratio: 3,
      'direct-and-inverse-proportion': 3,
    },
  },
  {
    query: 'direct proportion',
    expectedRelevance: {
      'direct-and-inverse-proportion': 3,
      ratio: 2,
    },
  },
  {
    query: 'surds',
    expectedRelevance: {
      surds: 3,
    },
  },
  {
    query: 'index laws',
    expectedRelevance: {
      'arithmetic-procedures-index-laws': 3,
    },
  },
  {
    query: 'indices',
    expectedRelevance: {
      'arithmetic-procedures-index-laws': 3,
    },
  },
  {
    query: 'standard form',
    expectedRelevance: {
      'standard-form-calculations': 3,
    },
  },
  {
    query: 'bounds',
    expectedRelevance: {
      'rounding-estimation-and-bounds': 3,
    },
  },
  {
    query: 'compound measures',
    expectedRelevance: {
      'compound-measures': 3,
    },
  },
] as const;
