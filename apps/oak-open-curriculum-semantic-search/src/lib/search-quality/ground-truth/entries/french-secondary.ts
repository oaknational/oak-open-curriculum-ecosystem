/**
 * French Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * French Secondary ground truth: Perfect tense with être.
 */
export const FRENCH_SECONDARY: MinimalGroundTruth = {
  subject: 'french',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'New Year celebrations perfect tense être',
  expectedRelevance: {
    'new-year-er-verbs-in-the-perfect-tense-with-etre': 3,
    'new-year-in-algeria-er-verbs-in-the-perfect-tense-with-etre': 3,
    'celebrations-information-questions-with-question-word-plus-est-ce-que': 2,
  },
  description:
    'Lesson teaches that movement verbs take être instead of avoir in the perfect tense.',
} as const;
