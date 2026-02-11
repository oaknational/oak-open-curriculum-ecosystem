/**
 * Music Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * Music Primary ground truth: Rounds as a singing structure.
 */
export const MUSIC_PRIMARY: LessonGroundTruth = {
  subject: 'music',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'singing rounds',
  expectedRelevance: {
    'rounds-as-a-singing-structure': 3,
    'part-singing-rounds-and-partner-songs': 2,
    'following-a-conductor-when-singing-rounds': 2,
  },
  description:
    'Lesson teaches that a round is a song structure where the same melody is sung in groups at different times.',
} as const;
