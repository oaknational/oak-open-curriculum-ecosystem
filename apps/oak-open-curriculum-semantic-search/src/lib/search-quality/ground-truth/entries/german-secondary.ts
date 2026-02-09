/**
 * German Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * German Secondary ground truth: Definite articles and gender.
 */
export const GERMAN_SECONDARY: LessonGroundTruth = {
  subject: 'german',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'definite articles der die das',
  expectedRelevance: {
    'greetings-and-location-wo-and-singular-definite-articles': 3,
    'what-people-have-haben-with-definite-and-indefinite-articles-accusative': 2,
    'who-has-what-haben-1st-3rd-person-singular-definite-article-den': 1,
  },
  description:
    'Lesson teaches the three German words for the (der, die, das) and grammatical gender.',
} as const;
