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
    category: 'natural-expression',
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
    category: 'imprecise-input',
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
    category: 'natural-expression',
    priority: 'high',
    description: 'Right/wrong = ethics.',
    expectedRelevance: {
      'the-nature-of-human-goodness': 3,
      'virtue-ethics': 3,
      'deontology-and-immanuel-kant': 2,
    },
  },

  // CROSS-TOPIC
  {
    query: 'ethics and religion together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of ethical philosophy with religious teachings.',
    expectedRelevance: {
      'virtue-ethics': 3,
      'dhamma-moral-precepts': 2,
    },
  },

  // PEDAGOGICAL-INTENT
  {
    query: 'discussion starter for sensitive topic',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for thoughtful RE discussion.',
    expectedRelevance: {
      'the-nature-of-human-goodness': 3,
      'virtue-ethics': 2,
    },
  },
] as const;
