/**
 * Precise-topic ground truth query for Secondary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), core physical geography topic.
 */
export const GEOGRAPHY_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'earthquakes tectonic plates',
    expectedRelevance: {
      earthquakes: 3,
      'the-movement-of-tectonic-plates': 2,
      'plate-boundaries': 2,
      'the-effects-of-earthquakes': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of earthquakes content using curriculum terminology',
  },
] as const;
