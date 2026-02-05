/**
 * Art Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Art Secondary ground truth: Colour theory and emotion.
 */
export const ART_SECONDARY: MinimalGroundTruth = {
  subject: 'art',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'colour theory emotion in art',
  expectedRelevance: {
    'the-elements-of-art-colour': 3,
    'abstract-art-painting-using-different-stimuli': 2,
    'exploring-portraits-through-paint': 1,
  },
  description:
    'Lesson teaches how colours carry different meanings and how to use colour to convey emotion in artwork.',
} as const;
