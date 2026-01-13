/**
 * Natural-expression ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests colloquial phrasing */
export const CITIZENSHIP_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'being fair to everyone rights',
    category: 'natural-expression',
    priority: 'high',
    description: 'Colloquial: "being fair" → equality, "rights" → legal protections',
    expectedRelevance: {
      'what-does-fairness-mean-in-society': 3,
      'why-do-we-need-laws-on-equality-in-the-uk': 2,
      'what-can-we-do-to-create-a-fairer-society': 2,
    },
  },
] as const;
