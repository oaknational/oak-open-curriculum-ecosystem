/**
 * Precise-topic ground truth query for Primary History.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Primary History.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), specific historical event (Boudica's rebellion),
 * expected slugs directly match lesson titles.
 */
export const HISTORY_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Boudica rebellion against Romans',
    expectedRelevance: {
      'boudicas-rebellion-against-roman-rule': 3,
      'the-roman-invasion-of-britain': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Boudica content using curriculum terminology',
  },
] as const;
