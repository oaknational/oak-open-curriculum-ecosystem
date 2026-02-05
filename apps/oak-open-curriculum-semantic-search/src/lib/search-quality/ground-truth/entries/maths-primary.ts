/**
 * Maths Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Maths Primary ground truth: Doubling patterns in times tables.
 */
export const MATHS_PRIMARY: MinimalGroundTruth = {
  subject: 'maths',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'double and double again multiples',
  expectedRelevance: {
    'explain-the-relationship-between-the-multiples-of-2-4-and-8': 3,
    'use-knowledge-of-the-relationship-between-the-2-4-and-8-times-tables-to-solve-problems': 2,
    'use-known-facts-to-solve-problems-involving-partitioning-numbers': 2,
  },
  description:
    'Lesson teaches that doubling multiples of 2 gives multiples of 4, doubling multiples of 4 gives multiples of 8.',
} as const;
