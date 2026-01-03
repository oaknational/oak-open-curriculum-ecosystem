/**
 * Hard ground truth queries for KS3 French search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for KS3 French.
 */
export const HARD_QUERIES_KS3_FRENCH: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach French negative sentences year 7',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request for negation.',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 3,
    },
  },

  // MISSPELLING
  {
    query: 'french grammer avoir etre',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common grammar misspelling.',
    expectedRelevance: {
      'what-isnt-done-negation-before-a-noun-with-avoir-etre-faire': 3,
    },
  },

  // SYNONYM
  {
    query: 'French saying no not',
    category: 'synonym',
    priority: 'high',
    description: 'Saying no = negation.',
    expectedRelevance: {
      'what-isnt-happening-ne-pas-negation': 3,
      'what-people-do-and-dont-do-ne-pas-negation': 3,
    },
  },
] as const;
