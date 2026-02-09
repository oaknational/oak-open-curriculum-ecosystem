/**
 * Art Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Art Primary ground truth: Patterns in nature.
 */
export const ART_PRIMARY: LessonGroundTruth = {
  subject: 'art',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'patterns in nature',
  expectedRelevance: {
    'patterns-in-nature': 3,
    'investigating-patterns-in-art': 2,
    'create-a-kaleidoscope-pattern': 1,
  },
  description:
    'Lesson teaches how patterns can be found in nature such as in leaves, shells, and flowers.',
} as const;
