/**
 * Hard ground truth queries for SECONDARY French search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for SECONDARY French.
 */
export const HARD_QUERIES_SECONDARY_FRENCH: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach French negative sentences year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for negation.',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
    },
  },

  // MISSPELLING
  {
    query: 'french grammer avoir etre',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common grammar misspelling.',
    expectedRelevance: {
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
    },
  },

  // SYNONYM
  {
    query: 'French saying no not',
    category: 'natural-expression',
    priority: 'high',
    description: 'Saying no = negation.',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 2,
    },
  },
] as const;
