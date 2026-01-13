/**
 * Natural-expression ground truth query for Primary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests teacher intent phrasing */
export const FRENCH_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach french greetings to children',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent phrasing for basic French vocabulary',
    expectedRelevance: {
      'introductions-voici-je-suis-and-il-elle-est': 3,
      'new-friends-mon-ma-ton-ta': 2,
    },
  },
] as const;
