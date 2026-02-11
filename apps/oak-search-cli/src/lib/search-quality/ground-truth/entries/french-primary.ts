/**
 * French Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * French Primary ground truth: Être with intonation questions.
 */
export const FRENCH_PRIMARY: LessonGroundTruth = {
  subject: 'french',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'intonation questions il elle est',
  expectedRelevance: {
    'what-is-he-or-she-like-intonation-questions': 3,
    'in-class-intonation-questions': 2,
    'who-has-what-singular-avoir-and-intonation-questions': 1,
  },
  description:
    'Lesson teaches how to use être with adjectives to ask and answer intonation questions.',
} as const;
