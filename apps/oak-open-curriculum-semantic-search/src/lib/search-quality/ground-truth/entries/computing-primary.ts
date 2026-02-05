/**
 * Computing Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Computing Primary ground truth: Types of loops in programming.
 */
export const COMPUTING_PRIMARY: MinimalGroundTruth = {
  subject: 'computing',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'count-controlled loops vs infinite loops',
  expectedRelevance: {
    'types-of-loops': 3,
    'combining-outputs': 1,
    'count-controlled-loops': 3,
  },
  description:
    'Lesson teaches the difference between count-controlled loops and infinite loops in programming.',
} as const;
