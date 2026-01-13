/**
 * Natural-expression ground truth query for Secondary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests teacher request phrasing */
export const FRENCH_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach French negative sentences year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for negation',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
    },
  },
] as const;
