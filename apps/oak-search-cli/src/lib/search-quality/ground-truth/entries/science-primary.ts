/**
 * Science Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * Science Primary ground truth: Earth rotation and day/night.
 */
export const SCIENCE_PRIMARY: LessonGroundTruth = {
  subject: 'science',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'day and night Earth rotation',
  expectedRelevance: {
    'why-we-have-day-and-night': 3,
    'why-the-sun-appears-to-move-across-the-sky': 3,
    'how-we-see-the-moon-from-earth': 1,
  },
  description:
    'Lesson teaches that the Sun appears to move across the sky because Earth rotates on its axis.',
} as const;
