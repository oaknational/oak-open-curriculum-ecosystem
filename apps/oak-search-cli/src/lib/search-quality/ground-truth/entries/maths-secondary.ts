/**
 * Maths Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * Maths Secondary ground truth: Dividing fractions using reciprocals.
 */
export const MATHS_SECONDARY: LessonGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'dividing fractions',
  expectedRelevance: {
    'dividing-a-fraction-by-a-fraction': 3,
    'checking-and-securing-dividing-a-fraction-by-a-whole-number': 2,
    'dividing-a-whole-number-by-a-fraction': 2,
  },
  description:
    'Lesson teaches dividing fractions by fractions using diagrams and the reciprocal method.',
} as const;
