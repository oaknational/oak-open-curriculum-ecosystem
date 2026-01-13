/**
 * Cross-topic ground truth query for Primary History.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Primary History.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000). Query combines Vikings (historical period)
 * AND trade/economics - tests ability to find content at intersection.
 */
export const HISTORY_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Vikings and trade in York',
    expectedRelevance: {
      'a-journey-through-viking-york-merchants-and-traders': 3,
      'how-we-know-so-much-about-viking-york': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of Viking history with economic/trade topics',
  },
] as const;
