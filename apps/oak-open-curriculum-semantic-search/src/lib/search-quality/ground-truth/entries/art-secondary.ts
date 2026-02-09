/**
 * Art Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Art Secondary ground truth: Colour theory and emotion.
 */
export const ART_SECONDARY: LessonGroundTruth = {
  subject: 'art',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'colour theory KS3',
  expectedRelevance: {
    'the-elements-of-art-colour': 3,
    'playing-with-colour-in-architecture-and-interiors': 2,
    'exploring-dyeing': 1,
  },
  description:
    'Lesson teaches how colours carry different meanings and how to use colour to convey emotion in artwork.',
} as const;
