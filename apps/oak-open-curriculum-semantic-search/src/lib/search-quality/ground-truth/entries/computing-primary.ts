/**
 * Computing Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Computing Primary ground truth: Types of loops in programming.
 */
export const COMPUTING_PRIMARY: LessonGroundTruth = {
  subject: 'computing',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'types of loops programming KS2',
  expectedRelevance: {
    'types-of-loops': 3,
    'using-loops-in-a-program': 2,
    'creating-a-program-that-uses-loops': 2,
  },
  description:
    'Lesson teaches the difference between count-controlled loops and infinite loops in programming.',
} as const;
