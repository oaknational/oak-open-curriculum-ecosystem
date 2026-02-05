/**
 * French Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * French Primary ground truth: Être with intonation questions.
 */
export const FRENCH_PRIMARY: MinimalGroundTruth = {
  subject: 'french',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'il est elle est intonation questions',
  expectedRelevance: {
    'what-is-he-or-she-like-intonation-questions': 3,
    'presentation-about-haiti-est-ce-que-questions': 2,
    'in-class-intonation-questions': 2,
  },
  description:
    'Lesson teaches how to use être with adjectives to ask and answer intonation questions.',
} as const;
