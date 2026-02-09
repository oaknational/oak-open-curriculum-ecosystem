/**
 * Physical Education Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Physical Education Secondary ground truth: Gymnastics sequences.
 */
export const PHYSICAL_EDUCATION_SECONDARY: LessonGroundTruth = {
  subject: 'physical-education',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'gymnastics sequences',
  expectedRelevance: {
    'creating-sequences-with-locomotion-rotation-and-balance': 3,
    'evaluating-and-refining-sequences': 2,
    'different-ways-to-move': 1,
  },
  description:
    'Lesson teaches how to create sequences with locomotion, rotation and balances using unison and canon patterns.',
} as const;
