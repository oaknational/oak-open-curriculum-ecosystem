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
    category: 'precise-topic',
    description: 'Tests retrieval of percentages unit using curriculum terminology',
  },
  {
    query: 'ratio',
    expectedRelevance: {
      ratio: 3,
      'direct-and-inverse-proportion': 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of ratio unit using curriculum terminology',
  },
  {
    query: 'ratio and proportion',
    expectedRelevance: {
      ratio: 3,
      'direct-and-inverse-proportion': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of ratio and proportion units using curriculum terminology',
  },
  {
    query: 'direct proportion',
    expectedRelevance: {
      'direct-and-inverse-proportion': 3,
      ratio: 2,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of proportion unit using curriculum terminology',
  },
  {
    query: 'surds',
    expectedRelevance: {
      surds: 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of surds unit using curriculum terminology',
  },
  {
    query: 'index laws',
    expectedRelevance: {
      'arithmetic-procedures-index-laws': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of index laws unit using curriculum terminology',
  },
  {
    query: 'indices',
    expectedRelevance: {
      'arithmetic-procedures-index-laws': 3,
    },
    category: 'natural-expression',
    description: 'Tests vocabulary bridging from indices to index laws curriculum term',
  },
  {
    query: 'standard form',
    expectedRelevance: {
      'standard-form-calculations': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of standard form unit using curriculum terminology',
  },
  {
    query: 'bounds',
    expectedRelevance: {
      'rounding-estimation-and-bounds': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of bounds unit using curriculum terminology',
  },
  {
    query: 'compound measures',
    expectedRelevance: {
      'compound-measures': 3,
    },
    category: 'precise-topic',
    description: 'Tests retrieval of compound measures unit using curriculum terminology',
  },
] as const;
