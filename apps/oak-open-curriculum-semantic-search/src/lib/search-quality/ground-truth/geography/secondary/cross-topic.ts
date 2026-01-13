/**
 * Cross-topic ground truth query for Secondary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - MRR 0.333, tests river processes + landforms intersection.
 */
export const GEOGRAPHY_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'river erosion and deposition landforms',
    expectedRelevance: {
      'river-processes': 3,
      'the-upper-course-of-a-river': 3,
      'the-middle-and-lower-course-of-a-river': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Cross-topic: processes + landforms',
  },
] as const;
