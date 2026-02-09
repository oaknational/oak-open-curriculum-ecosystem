/**
 * Spanish Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Spanish Primary ground truth: Estar for greetings and location.
 */
export const SPANISH_PRIMARY: LessonGroundTruth = {
  subject: 'spanish',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'greetings estar',
  expectedRelevance: {
    'greetings-the-verb-estar': 3,
    'i-am-pleased-estoy-and-esta-for-state': 2,
    'how-are-you-today-and-usually-estar-for-states-and-ser-for-traits': 1,
  },
  description: 'Lesson teaches how to use estoy and está for greetings and location.',
} as const;
