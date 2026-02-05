/**
 * Maths Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Maths Secondary ground truth: Dividing fractions using reciprocals.
 */
export const MATHS_SECONDARY: MinimalGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'dividing fractions using reciprocals',
  expectedRelevance: {
    'dividing-a-fraction-by-a-fraction': 3,
    'dividing-with-decimals': 2,
    'checking-and-securing-dividing-a-fraction-by-a-whole-number': 2,
  },
  description:
    'Lesson teaches dividing fractions by fractions using diagrams and the reciprocal method.',
} as const;
