/**
 * Natural-expression ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests colloquial phrasing */
export const ART_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'feelings in pictures',
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial: "feelings" → emotions, "pictures" → art',
    expectedRelevance: {
      'expressing-emotion-through-art': 3,
      'art-as-self-discovery': 2,
    },
  },
] as const;
