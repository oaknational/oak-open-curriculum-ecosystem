/**
 * Cross-topic ground truth query for Primary Science.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Primary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.250 reflects challenge of cross-topic intersection.
 * Query combines animals AND food/nutrition - tests ability to find
 * content at intersection of these two science curriculum areas.
 */
export const SCIENCE_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'animals and food together',
    expectedRelevance: {
      'what-animals-eat': 3,
      'animal-structure': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of animal classification with nutrition/diet',
  },
] as const;
