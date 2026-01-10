/**
 * Hard ground truth queries for SECONDARY German search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for SECONDARY German.
 */
export const HARD_QUERIES_SECONDARY_GERMAN: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach German verb endings year 7',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request for verb conjugation.',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
    },
  },

  // MISSPELLING
  {
    query: 'german grammer present tence',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspellings.',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
    },
  },

  // SYNONYM
  {
    query: 'German doing words at school',
    category: 'natural-expression',
    priority: 'high',
    description: 'Doing words = verbs.',
    expectedRelevance: {
      'school-activities-infinitives-present-tense-3rd-person-singular': 3,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 2,
    },
  },

  // CROSS-TOPIC
  {
    query: 'German verbs and vocabulary together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of grammar with vocabulary topics.',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
    },
  },

  // PEDAGOGICAL-INTENT
  {
    query: 'confidence building speaking practice',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for oral skill development.',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
    },
  },
] as const;
