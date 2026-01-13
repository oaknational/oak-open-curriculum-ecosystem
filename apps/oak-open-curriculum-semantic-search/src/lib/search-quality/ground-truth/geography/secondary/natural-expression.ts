/**
 * Natural-expression ground truth query for Secondary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - MRR 0.200, tests "global warming" = "climate change" synonym.
 */
export const GEOGRAPHY_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'global warming effects',
    expectedRelevance: {
      'causes-of-climate-change': 3,
      'impacts-of-climate-change-on-the-uk': 3,
      'actions-to-tackle-climate-change': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Global warming = climate change - tests vocabulary bridging',
  },
] as const;
