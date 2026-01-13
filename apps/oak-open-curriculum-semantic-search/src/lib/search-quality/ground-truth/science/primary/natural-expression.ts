/**
 * Natural-expression ground truth query for Primary Science.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Primary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000) despite highly informal language
 * ("that Darwin bird lesson"). Search correctly identifies Darwin
 * finches content from colloquial description.
 */
export const SCIENCE_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'that Darwin bird lesson',
    expectedRelevance: {
      'charles-darwin-and-finches': 3,
      'evolution-evidence': 2,
    },
    category: 'natural-expression',
    priority: 'medium',
    description: 'Informal reference to Darwin finches lesson - tests colloquial language',
  },
] as const;
