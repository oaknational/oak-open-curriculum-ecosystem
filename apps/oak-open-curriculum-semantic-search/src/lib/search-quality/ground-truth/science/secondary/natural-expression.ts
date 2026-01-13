/**
 * Natural-expression ground truth query for Secondary Science.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Secondary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000). "Living organism processes" is a
 * natural way to describe life processes. Search correctly bridges
 * to curriculum terminology.
 */
export const SCIENCE_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'living organism processes',
    expectedRelevance: {
      'the-common-processes-of-all-living-organisms': 3,
      'cellular-respiration': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Living organism = life processes - tests vocabulary bridging',
  },
] as const;
