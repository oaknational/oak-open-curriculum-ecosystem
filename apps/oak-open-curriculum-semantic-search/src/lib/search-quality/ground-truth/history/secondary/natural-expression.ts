/**
 * Natural-expression ground truth query for Secondary History.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-11
 * Decision: KEEP - Perfect MRR (1.000), tests "factory age" = Industrial Revolution synonym.
 */
export const HISTORY_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'factory age workers conditions',
    expectedRelevance: {
      'the-industrial-revolution-and-change-in-britain': 3,
      'the-industrial-revolution-and-urban-migration': 3,
      'inventions-of-the-industrial-revolution': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Factory age = Industrial Revolution - tests vocabulary bridging',
  },
] as const;
