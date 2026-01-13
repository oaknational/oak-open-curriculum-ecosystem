/**
 * Natural-expression ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests synonym mapping */
export const COMPUTING_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'coding for beginners programming basics introduction',
    category: 'natural-expression',
    priority: 'high',
    description: 'Synonym: "coding" → programming, "beginners" → introduction',
    expectedRelevance: {
      'good-programming-practices': 3,
      'approaching-a-programming-project': 3,
      'problem-solving-using-programming-constructs': 2,
    },
  },
] as const;
