/**
 * Maths Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Maths Primary ground truth: Doubling patterns in times tables.
 */
export const MATHS_PRIMARY: LessonGroundTruth = {
  subject: 'maths',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'multiples of 2 4 and 8',
  expectedRelevance: {
    'explain-the-relationship-between-the-multiples-of-2-4-and-8': 3,
    'explain-the-relationship-between-multiples-of-4-and-multiples-of-8': 2,
    'use-knowledge-of-the-relationship-between-the-2-4-and-8-times-tables-to-solve-problems': 2,
  },
  description:
    'Lesson teaches that doubling multiples of 2 gives multiples of 4, doubling multiples of 4 gives multiples of 8.',
} as const;
