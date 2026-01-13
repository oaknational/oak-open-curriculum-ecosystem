/**
 * Precise-topic ground truth query for Secondary History.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), important curriculum topic.
 */
export const HISTORY_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Holocaust Nazi persecution',
    expectedRelevance: {
      'nazi-persecution-of-jewish-people': 3,
      'the-holocaust-in-context': 2,
      'ghettos-and-the-final-solution': 2,
      'victims-and-perpetrators': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Holocaust content using curriculum terminology',
  },
] as const;
