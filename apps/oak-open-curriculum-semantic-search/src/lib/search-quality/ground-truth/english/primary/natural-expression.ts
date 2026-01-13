/**
 * Natural-expression ground truth query for Primary English.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Primary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000) despite highly informal language
 * ("that Roald Dahl book with the giant"). Search correctly identifies
 * The BFG content from colloquial description.
 */
export const ENGLISH_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'that Roald Dahl book with the giant BFG reading',
    expectedRelevance: {
      'engaging-with-the-bfg': 3,
      'engaging-with-the-opening-chapter-of-the-bfg': 3,
      'writing-the-opening-of-the-bfg-part-one': 2,
    },
    category: 'natural-expression',
    priority: 'medium',
    description: 'Informal reference to The BFG - tests colloquial language understanding',
  },
] as const;
