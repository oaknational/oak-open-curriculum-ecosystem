/**
 * Spanish Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Spanish Primary ground truth: Estar for greetings and location.
 */
export const SPANISH_PRIMARY: MinimalGroundTruth = {
  subject: 'spanish',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'estar estoy está location hello hola',
  expectedRelevance: {
    'greetings-the-verb-estar': 3,
    'in-class-estoy-and-esta-for-location': 3,
    'who-is-in-class-estoy-estas-and-esta-to-answer-the-register': 2,
  },
  description: 'Lesson teaches how to use estoy and está for greetings and location.',
} as const;
