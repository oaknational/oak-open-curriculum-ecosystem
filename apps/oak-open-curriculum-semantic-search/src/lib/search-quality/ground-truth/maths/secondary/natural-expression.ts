/**
 * Natural-expression ground truth query for Secondary Maths.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Secondary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000) despite highly informal language
 * ("the bit where you"). Tests noise filtering and semantic understanding.
 * Search correctly identifies completing-the-square lessons despite
 * conversational phrasing.
 */
export const MATHS_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'the bit where you complete the square',
    expectedRelevance: {
      'solving-quadratic-equations-by-completing-the-square': 3,
      'solving-complex-quadratic-equations-by-completing-the-square': 3,
      'factorising-using-the-difference-of-two-squares': 2,
    },
    category: 'natural-expression',
    priority: 'medium',
    description: 'Informal language with noise words - tests semantic understanding',
  },
] as const;
