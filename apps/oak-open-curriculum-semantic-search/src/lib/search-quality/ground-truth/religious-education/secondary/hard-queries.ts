/**
 * Hard ground truth queries for SECONDARY Religious Education search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for SECONDARY RE.
 */
export const HARD_QUERIES_SECONDARY_RE: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach about different world religions year 8',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request for comparative religion.',
    expectedRelevance: {
      'siddhartha-gautama-as-a-historical-figure': 3,
      'the-buddha-through-the-eyes-of-devotees': 2,
    },
  },

  // MISSPELLING
  {
    query: 'buddism and the dhama',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common Buddhism/Dhamma misspellings.',
    expectedRelevance: {
      'dhamma-moral-precepts': 3,
      'dhamma-skilful-actions': 3,
      'siddhartha-gautama-as-a-historical-figure': 2,
    },
  },

  // SYNONYM
  {
    query: 'right and wrong philosophy',
    category: 'synonym',
    priority: 'high',
    description: 'Right/wrong = ethics.',
    expectedRelevance: {
      'the-nature-of-human-goodness': 3,
      'virtue-ethics': 3,
      'deontology-and-immanuel-kant': 2,
    },
  },
] as const;
