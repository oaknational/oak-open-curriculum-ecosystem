/**
 * Spanish Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Spanish Secondary ground truth: Ser and estar usage.
 */
export const SPANISH_SECONDARY: LessonGroundTruth = {
  subject: 'spanish',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'ser and estar feelings',
  expectedRelevance: {
    'how-are-you-feeling-ser-and-estar-1st-and-2nd-person-singular': 3,
    'people-ser-and-estar-singular-persons': 2,
    'a-trip-to-asturias-ser-and-estar-1st-and-3rd-person': 2,
  },
  description: 'Lesson teaches when to use estoy (estar) versus soy (ser) for different contexts.',
} as const;
