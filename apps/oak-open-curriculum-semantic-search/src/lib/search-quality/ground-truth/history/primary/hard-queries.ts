/**
 * Hard ground truth queries for Primary History search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for Primary History.
 */
export const HARD_QUERIES_PRIMARY_HISTORY: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach year 4 about the Romans',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request with year group.',
    expectedRelevance: {
      'the-roman-invasion-of-britain': 3,
      'the-buildings-of-roman-britain': 3,
      'towns-in-roman-britain': 2,
    },
  },

  // MISSPELLING
  {
    query: 'vikins and anglo saxons',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common Vikings misspelling.',
    expectedRelevance: {
      'early-viking-raids': 3,
      'why-the-vikings-came-to-britain': 3,
      'the-anglo-saxon-fightback': 2,
    },
  },
] as const;
