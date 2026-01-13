/**
 * Imprecise-input ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "internat" misspelling */
export const COMPUTING_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'how does the internat work',
    expectedRelevance: {
      'the-internet-and-world-wide-web': 3,
      'connecting-networks': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of internet - tests fuzzy recovery',
  },
] as const;
