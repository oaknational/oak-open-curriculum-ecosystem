/**
 * KS3 German ground truth queries for grammar topics.
 *
 * Covers present tense weak verbs, cases.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Grammar ground truth queries for KS3 German.
 */
export const GRAMMAR_KS3_GERMAN: readonly GroundTruthQuery[] = [
  {
    query: 'German present tense weak verbs',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 2,
    },
  },
  {
    query: 'German infinitives verbs',
    expectedRelevance: {
      'school-activities-infinitives-present-tense-3rd-person-singular': 3,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 3,
    },
  },
  {
    query: 'German school vocabulary',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
    },
  },
] as const;
