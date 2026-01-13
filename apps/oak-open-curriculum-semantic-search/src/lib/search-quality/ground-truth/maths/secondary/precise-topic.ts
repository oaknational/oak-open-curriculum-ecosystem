/**
 * Precise-topic ground truth query for Secondary Maths.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Secondary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), core GCSE topic (quadratic factorising),
 * expected slugs directly match lesson titles using standard terminology.
 * Actual top results: solving-quadratic-equations-by-factorising variants.
 */
export const MATHS_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'solving quadratic equations by factorising',
    expectedRelevance: {
      'solving-quadratic-equations-by-factorising': 3,
      'solving-quadratic-equations-by-factorising-where-rearrangement-is-required': 3,
      'factorising-a-quadratic-expression': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of quadratic factorising content using curriculum terminology',
  },
] as const;
