/**
 * Cross-topic ground truth query for Secondary Maths.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Secondary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.333 reflects challenge of cross-topic intersection.
 * Query combines algebra AND graphing - tests hybrid retriever's ability
 * to find content at topic intersections (simultaneous equations graphically).
 */
export const MATHS_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'combining algebra with graphs',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-graphically': 3,
      'solving-a-quadratic-and-linear-pair-of-simultaneous-equations-graphically': 3,
      'problem-solving-with-linear-and-quadratic-simultaneous-equations': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Cross-topic intersection - tests algebra+graphing overlap',
  },
] as const;
