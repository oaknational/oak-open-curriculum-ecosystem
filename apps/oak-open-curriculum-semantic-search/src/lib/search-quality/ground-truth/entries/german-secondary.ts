/**
 * German Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * German Secondary ground truth: Definite articles and gender.
 */
export const GERMAN_SECONDARY: MinimalGroundTruth = {
  subject: 'german',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'German definite articles der die das gender',
  expectedRelevance: {
    'greetings-and-location-wo-and-singular-definite-articles': 3,
    'narrating-with-nouns-singular-definite-articles': 3,
    'what-people-have-haben-with-definite-and-indefinite-articles-accusative': 2,
  },
  description:
    'Lesson teaches the three German words for the (der, die, das) and grammatical gender.',
} as const;
