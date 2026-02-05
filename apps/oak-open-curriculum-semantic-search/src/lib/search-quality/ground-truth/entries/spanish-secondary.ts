/**
 * Spanish Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Spanish Secondary ground truth: Ser and estar usage.
 */
export const SPANISH_SECONDARY: MinimalGroundTruth = {
  subject: 'spanish',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'ser estar feelings estoy soy',
  expectedRelevance: {
    'how-are-you-feeling-ser-and-estar-1st-and-2nd-person-singular': 3,
    'a-trip-to-asturias-ser-and-estar-1st-and-3rd-person': 2,
    'character-or-mood-ser-and-estar-in-1st-and-2nd-person-singular': 3,
  },
  description: 'Lesson teaches when to use estoy (estar) versus soy (ser) for different contexts.',
} as const;
