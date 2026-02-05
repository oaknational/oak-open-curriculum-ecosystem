/**
 * Computing Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Computing Secondary ground truth: Python while loops and iteration.
 */
export const COMPUTING_SECONDARY: MinimalGroundTruth = {
  subject: 'computing',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'Python while loops iteration',
  expectedRelevance: {
    'iteration-using-while-loops': 3,
    'using-for-loops-to-iterate-data-structures': 2,
    'iterating-through-data-structures': 2,
  },
  description: 'Lesson teaches condition controlled iteration using while loops in Python.',
} as const;
