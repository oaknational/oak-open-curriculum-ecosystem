/**
 * Imprecise-input ground truth query for Primary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests "techneeques" misspelling */
export const ART_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'painting techneeques primary',
    expectedRelevance: {
      'explore-a-variety-of-painting-techniques': 3,
      'expressive-mark-making': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of techniques - tests fuzzy recovery',
  },
] as const;
