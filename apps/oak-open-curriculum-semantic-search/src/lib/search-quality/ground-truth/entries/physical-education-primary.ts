/**
 * Physical Education Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Physical Education Primary ground truth: Individual and pair balances.
 */
export const PHYSICAL_EDUCATION_PRIMARY: LessonGroundTruth = {
  subject: 'physical-education',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'gymnastics balances pairs',
  expectedRelevance: {
    'balances-individually-and-in-pairs': 3,
    'counter-balance': 2,
    'sequence-formation-combining-individual-and-pair-balances': 2,
  },
  description: 'Lesson teaches how to create quality balances individually and with a partner.',
} as const;
