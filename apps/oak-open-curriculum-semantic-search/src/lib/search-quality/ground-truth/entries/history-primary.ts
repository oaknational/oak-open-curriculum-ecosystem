/**
 * History Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * History Primary ground truth: Roman invasion of Britain.
 */
export const HISTORY_PRIMARY: MinimalGroundTruth = {
  subject: 'history',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'Roman invasion Britain Emperor Claudius',
  expectedRelevance: {
    'the-roman-invasion-of-britain': 3,
    'boudicas-rebellion-against-roman-rule': 2,
    'the-conversion-of-the-british-isles': 1,
  },
  description:
    'Lesson teaches how Emperor Claudius ordered the invasion of Britain in 43 CE and Roman army tactics.',
} as const;
