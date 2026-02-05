/**
 * Physical Education Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Physical Education Primary ground truth: Individual and pair balances.
 */
export const PHYSICAL_EDUCATION_PRIMARY: MinimalGroundTruth = {
  subject: 'physical-education',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'individual and pair balances creative',
  expectedRelevance: {
    'balances-individually-and-in-pairs': 3,
    'sequence-formation-combining-individual-and-pair-balances': 3,
    symmetry: 2,
  },
  description: 'Lesson teaches how to create quality balances individually and with a partner.',
} as const;
