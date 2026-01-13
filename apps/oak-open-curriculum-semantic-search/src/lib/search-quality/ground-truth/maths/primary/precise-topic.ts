/**
 * Precise-topic ground truth query for Primary Maths.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Primary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), fundamental curriculum topic (place value),
 * expected slugs directly match lesson titles using standard terminology.
 * Actual top results match expected - partition-two-digit-numbers-into-tens-and-ones variants.
 */
export const MATHS_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'place value tens and ones',
    expectedRelevance: {
      'partition-two-digit-numbers-into-tens-and-ones-using-place-value-resources': 3,
      'partition-two-digit-numbers-into-tens-and-ones': 3,
      'explain-that-one-ten-is-equivalent-to-ten-ones': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of place value tens and ones content using curriculum terminology',
  },
] as const;
