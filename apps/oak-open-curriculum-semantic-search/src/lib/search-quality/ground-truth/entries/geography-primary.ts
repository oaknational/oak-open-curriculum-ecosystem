/**
 * Geography Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Geography Primary ground truth: River journey from source to mouth.
 */
export const GEOGRAPHY_PRIMARY: LessonGroundTruth = {
  subject: 'geography',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'river changes on its journey from source to mouth',
  expectedRelevance: {
    'the-rivers-journey': 3,
    'introducing-rivers': 2,
    'rivers-in-the-uk': 1,
  },
  description: 'Lesson teaches how rivers change as they flow from source to mouth.',
} as const;
