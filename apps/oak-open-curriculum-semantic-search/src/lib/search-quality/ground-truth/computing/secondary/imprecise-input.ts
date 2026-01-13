/**
 * Imprecise-input ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "internat" misspelling */
export const COMPUTING_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'how the internat works fundamentals basics',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "internet" - tests fuzzy recovery',
    expectedRelevance: {
      'the-internet': 3,
      'internet-fundamentals': 3,
      'an-introduction-to-computer-networks': 2,
    },
  },
] as const;
