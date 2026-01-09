/**
 * SECONDARY German ground truth queries for grammar topics.
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
 * Grammar ground truth queries for SECONDARY German.
 */
export const GRAMMAR_SECONDARY_GERMAN: readonly GroundTruthQuery[] = [
  {
    query: 'German present tense weak verbs',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
      'school-activities-infinitives-present-tense-3rd-person-singular': 2,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 1,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of German present tense content using curriculum terminology',
  },
  {
    query: 'German infinitives verbs',
    expectedRelevance: {
      'school-activities-infinitives-present-tense-3rd-person-singular': 3,
      'what-i-do-at-school-infinitives-present-tense-3rd-person-singular': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of German infinitives content using curriculum terminology',
  },
  {
    query: 'German school vocabulary',
    expectedRelevance: {
      'at-and-after-school-present-tense-weak-verbs-1st-and-3rd-person-singular': 3,
      'at-school-and-at-home-present-tense-weak-verbs-1st-and-3rd-person-singular': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of German school vocabulary content using curriculum terminology',
  },
  {
    query: 'German question words and word order',
    expectedRelevance: {
      'kultur-in-deutschland-wh-question-words': 3,
      'die-schweiz-deutschland-bayern-numbers-word-order-inversion': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests German interrogative and syntax retrieval.',
  },
  {
    query: 'verbs and questions in German',
    expectedRelevance: {
      'wer-ist-bella-was-macht-sie-present-tense-verbs-yes-no-questions': 3,
      'kultur-in-deutschland-wh-question-words': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of verb conjugation with question formation.',
  },
] as const;
