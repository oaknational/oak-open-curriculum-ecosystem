/**
 * Hard ground truth queries for KS3 German search.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for KS3 German.
 */
export const HARD_QUERIES_KS3_GERMAN: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach German verb endings year 7',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request for verb conjugation.',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'school-activities-infinitives-present-tense-3rd-person-singular': 3,
    },
  },

  // MISSPELLING
  {
    query: 'german grammer present tence',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspellings.',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
    },
  },

  // SYNONYM
  {
    query: 'German doing words at school',
    category: 'synonym',
    priority: 'high',
    description: 'Doing words = verbs.',
    expectedRelevance: {
      'school-activities-infinitives-present-tense-3rd-person-singular': 3,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 3,
    },
  },
] as const;
