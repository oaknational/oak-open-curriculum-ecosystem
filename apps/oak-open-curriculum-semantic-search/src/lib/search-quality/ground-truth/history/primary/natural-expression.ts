/**
 * Natural-expression ground truth query for Primary History.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Primary History.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.500 reflects realistic teacher query format.
 * "teach year 4 about the Romans" is how teachers actually search.
 */
export const HISTORY_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach year 4 about the Romans',
    expectedRelevance: {
      'the-roman-invasion-of-britain': 3,
      'the-buildings-of-roman-britain': 3,
      'towns-in-roman-britain': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request with year group - tests informal phrasing',
  },
] as const;
