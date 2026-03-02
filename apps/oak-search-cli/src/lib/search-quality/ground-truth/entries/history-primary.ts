/**
 * History Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * History Primary ground truth: Roman invasion of Britain.
 */
export const HISTORY_PRIMARY: LessonGroundTruth = {
  subject: 'history',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'Roman invasion Britain',
  expectedRelevance: {
    'the-roman-invasion-of-britain': 3,
    'britain-at-the-end-of-roman-rule': 2,
    'the-changes-to-life-brought-about-by-roman-settlement': 1,
  },
  description:
    'Lesson teaches how Emperor Claudius ordered the invasion of Britain in 43 CE and Roman army tactics.',
} as const;
