/**
 * Precise-topic ground truth query for Primary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), core UK geography topic.
 */
export const GEOGRAPHY_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'UK countries capitals',
    expectedRelevance: {
      'the-uk-and-its-surrounding-seas': 3,
      'the-countries-and-capital-cities-of-the-uk': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests UK geography locational knowledge retrieval',
  },
] as const;
