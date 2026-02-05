/**
 * Design Technology Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Design Technology Secondary ground truth: Linear vs circular economy.
 */
export const DESIGN_TECHNOLOGY_SECONDARY: MinimalGroundTruth = {
  subject: 'design-technology',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'linear vs circular economy cradle grave',
  expectedRelevance: {
    'linear-versus-circular-economy': 3,
    'selecting-materials-for-manufacture': 2,
    'repair-maintenance-and-recycling': 2,
  },
  description:
    'Lesson teaches the difference between linear economy (cradle to grave) and circular economy (cradle to cradle).',
} as const;
