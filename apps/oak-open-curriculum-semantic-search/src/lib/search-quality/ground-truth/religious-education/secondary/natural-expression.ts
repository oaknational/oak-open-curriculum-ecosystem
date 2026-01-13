/**
 * Natural-expression ground truth query for Secondary Religious Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests synonym mapping */
export const RE_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'right and wrong philosophy',
    category: 'natural-expression',
    priority: 'high',
    description: 'Right/wrong = ethics',
    expectedRelevance: {
      'the-nature-of-human-goodness': 3,
      'virtue-ethics': 3,
      'deontology-and-immanuel-kant': 2,
    },
  },
] as const;
