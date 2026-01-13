/**
 * Natural-expression ground truth query for Secondary English.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Secondary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000) despite informal teacher request format.
 * "teach students about" is realistic teacher phrasing. Search correctly
 * identifies Gothic literature content.
 */
export const ENGLISH_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach students about gothic literature year 8',
    expectedRelevance: {
      'diving-deeper-into-the-gothic-genre': 3,
      'frankenstein-and-the-gothic-context': 3,
      'gothic-vocabulary-in-jane-eyre': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request with year group specification - tests informal phrasing',
  },
] as const;
