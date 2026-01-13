/**
 * Cross-topic ground truth query for Secondary Science.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Secondary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000). Query combines predator-prey
 * relationships AND ecosystem concepts - tests ability to find
 * content at intersection of ecology and animal behaviour.
 */
export const SCIENCE_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'predator and prey ecosystem relationships',
    expectedRelevance: {
      'predator-prey-relationships': 3,
      'adaptations-of-predators-and-prey': 3,
      'food-webs': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Cross-topic intersection: ecology + behaviour',
  },
] as const;
