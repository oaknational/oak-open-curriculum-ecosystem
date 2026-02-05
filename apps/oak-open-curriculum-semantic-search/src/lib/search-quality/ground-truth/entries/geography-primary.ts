/**
 * Geography Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Geography Primary ground truth: River journey from source to mouth.
 */
export const GEOGRAPHY_PRIMARY: MinimalGroundTruth = {
  subject: 'geography',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'river source to mouth course',
  expectedRelevance: {
    'the-rivers-journey': 3,
    'introducing-rivers': 2,
    'rivers-in-europe': 2,
  },
  description: 'Lesson teaches how rivers change as they flow from source to mouth.',
} as const;
