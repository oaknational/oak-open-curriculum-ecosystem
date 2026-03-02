/**
 * Design Technology Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * Design Technology Primary ground truth: Cam mechanisms.
 */
export const DESIGN_TECHNOLOGY_PRIMARY: LessonGroundTruth = {
  subject: 'design-technology',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'cam mechanisms',
  expectedRelevance: {
    'cam-mechanisms': 3,
    'cams-in-a-product': 2,
    'assemble-cam-mechanisms': 2,
  },
  description: 'Lesson teaches how cams convert rotary motion into linear motion.',
} as const;
