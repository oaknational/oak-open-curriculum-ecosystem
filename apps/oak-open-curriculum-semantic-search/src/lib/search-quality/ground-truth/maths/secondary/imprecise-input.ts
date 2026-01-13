/**
 * Imprecise-input ground truth query for Secondary Maths.
 *
 * Tests error recovery when teachers make typing mistakes.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Imprecise-input query for Secondary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000) with two misspellings in 4 words
 * ("simulatneous equasions"). Tests fuzzy matching and ELSER recovery.
 * Critical for mobile UX where typos are common.
 */
export const MATHS_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'simulatneous equasions substitution method',
    expectedRelevance: {
      'solving-simultaneous-linear-equations-by-substitution': 3,
      'forming-simultaneous-equations': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Two misspellings in 4 words - tests fuzzy + ELSER recovery',
  },
] as const;
