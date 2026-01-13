/**
 * Natural-expression ground truth query for Primary Maths.
 *
 * Tests vocabulary bridging when teachers use everyday language
 * instead of curriculum terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Natural-expression query for Primary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.200 correctly reflects vocabulary bridging challenge.
 * Query "takeaway sums" is realistic teacher/parent language for subtraction.
 * Search must bridge colloquial "takeaway" to curriculum "subtraction".
 * Expected slugs are the correct subtraction lessons.
 */
export const MATHS_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'takeaway sums primary',
    expectedRelevance: {
      'subtracting-to-and-from-10': 3,
      'subtracting-numbers-that-bridge-through-10': 3,
      'subtracting-small-numbers': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial term for subtraction - tests vocabulary bridging',
  },
] as const;
