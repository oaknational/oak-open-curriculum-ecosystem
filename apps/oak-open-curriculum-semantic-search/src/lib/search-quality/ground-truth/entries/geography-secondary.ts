/**
 * Geography Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Geography Secondary ground truth: Plate boundaries and tectonics.
 */
export const GEOGRAPHY_SECONDARY: LessonGroundTruth = {
  subject: 'geography',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'plate boundaries',
  expectedRelevance: {
    'plate-boundaries': 3,
    earthquakes: 2,
    'types-of-volcanoes': 2,
  },
  description:
    'Lesson teaches the four main types of plate boundary and the tectonic hazards at each.',
} as const;
