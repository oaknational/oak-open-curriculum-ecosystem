/**
 * Geography Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Geography Secondary ground truth: Plate boundaries and tectonics.
 */
export const GEOGRAPHY_SECONDARY: MinimalGroundTruth = {
  subject: 'geography',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'types of plate boundaries tectonics',
  expectedRelevance: {
    'plate-boundaries': 3,
    'types-of-volcanoes': 2,
    earthquakes: 2,
  },
  description:
    'Lesson teaches the four main types of plate boundary and the tectonic hazards at each.',
} as const;
