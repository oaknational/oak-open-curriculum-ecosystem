/**
 * Hard ground truth queries for KS3 Spanish search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for KS3 Spanish.
 */
export const HARD_QUERIES_KS3_SPANISH: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach Spanish verb endings year 7',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request for verb conjugation.',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3,
    },
  },

  // MISSPELLING
  {
    query: 'spanish grammer conjugating verbs',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common grammar misspelling.',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'conversation-with-a-friend-ar-verbs-1st-and-3rd-person-singular': 3,
    },
  },

  // SYNONYM
  {
    query: 'Spanish action words changing',
    category: 'synonym',
    priority: 'high',
    description: 'Action words = verbs, changing = conjugation.',
    expectedRelevance: {
      'a-big-adventure-ar-verbs-3rd-person-singular': 3,
      'a-school-play-ar-verbs-2nd-person-singular-information-questions': 2,
    },
  },
] as const;
