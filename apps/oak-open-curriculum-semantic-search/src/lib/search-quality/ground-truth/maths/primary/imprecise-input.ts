/**
 * Imprecise-input ground truth query for Primary Maths.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Primary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.500 shows good typo recovery for "halfs" (should be "halves").
 * Common misspelling that teachers make. Search correctly identifies
 * fraction lessons despite the error.
 */
export const MATHS_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'halfs and quarters',
    expectedRelevance: {
      'recognise-and-name-the-fraction-one-half': 3,
      'recognise-and-name-the-fraction-one-quarter': 3,
      'find-one-half-of-a-number': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of halves - tests typo recovery',
  },
] as const;
