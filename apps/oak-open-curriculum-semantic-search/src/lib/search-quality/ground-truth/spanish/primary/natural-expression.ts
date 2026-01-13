/**
 * Natural-expression ground truth query for Primary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests teacher intent phrasing */
export const SPANISH_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach spanish greetings to children',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent phrasing for basic Spanish vocabulary',
    expectedRelevance: {
      'greetings-the-verb-estar': 3,
      'how-are-you-today-today-estoy-and-estas-for-states': 2,
    },
  },
] as const;
