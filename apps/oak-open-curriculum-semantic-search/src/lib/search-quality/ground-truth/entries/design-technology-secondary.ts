/**
 * Design Technology Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Design Technology Secondary ground truth: Linear vs circular economy.
 */
export const DESIGN_TECHNOLOGY_SECONDARY: LessonGroundTruth = {
  subject: 'design-technology',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'linear circular economy sustainability',
  expectedRelevance: {
    'linear-versus-circular-economy': 3,
    'repair-maintenance-and-recycling': 2,
    'product-in-use': 1,
  },
  description:
    'Lesson teaches the difference between linear economy (cradle to grave) and circular economy (cradle to cradle).',
} as const;
