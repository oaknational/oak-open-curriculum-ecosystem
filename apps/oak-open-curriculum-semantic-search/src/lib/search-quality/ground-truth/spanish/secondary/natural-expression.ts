/**
 * Natural-expression ground truth query for Secondary Spanish.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests teacher request phrasing */
export const SPANISH_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach Spanish verb endings year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for verb conjugation',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
    },
  },
] as const;
