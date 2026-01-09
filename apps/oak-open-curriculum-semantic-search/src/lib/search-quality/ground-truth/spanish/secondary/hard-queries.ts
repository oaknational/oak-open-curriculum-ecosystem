/**
 * Hard ground truth queries for SECONDARY Spanish search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for SECONDARY Spanish.
 */
export const HARD_QUERIES_SECONDARY_SPANISH: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach Spanish verb endings year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for verb conjugation.',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
    },
  },

  // MISSPELLING
  {
    query: 'spanish grammer conjugating verbs',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common grammar misspelling.',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 2,
    },
  },

  // SYNONYM
  {
    query: 'Spanish action words changing',
    category: 'natural-expression',
    priority: 'high',
    description: 'Action words = verbs, changing = conjugation.',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 2,
    },
  },
] as const;
