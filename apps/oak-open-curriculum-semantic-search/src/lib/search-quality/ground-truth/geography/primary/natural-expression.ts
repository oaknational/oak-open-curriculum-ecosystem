/**
 * Natural-expression ground truth query for Primary Geography.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), question format with key stage reference.
 */
export const GEOGRAPHY_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'where is our school ks1',
    expectedRelevance: {
      'our-school': 3,
      'our-school-from-above': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format with key stage reference - tests informal phrasing',
  },
] as const;
