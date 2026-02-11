/**
 * Sequence ground truth: Maths Secondary
 *
 * Ground truth for testing sequence search quality using Known-Answer-First methodology.
 *
 * ## Source Data
 *
 * Explored: `bulk-downloads/maths-secondary.json`
 * Target sequence: `maths-secondary`
 *
 * ## Sequence Content (from bulk data)
 *
 * The maths-secondary sequence contains the full secondary mathematics curriculum
 * spanning KS3 and KS4 (Years 7-11). It includes units covering:
 * - Number and place value
 * - Fractions, decimals, percentages
 * - Algebra and equations
 * - Geometry and measure
 * - Statistics and probability
 *
 * ## Query Design
 *
 * A teacher looking for the complete secondary maths programme would search
 * for curriculum/programme level terms. Query tested via test-query-sequences.ts.
 *
 * ## Test Results
 *
 * Position 1: maths-secondary - TARGET
 */

import type { SequenceGroundTruth } from '../types';

/**
 * Secondary maths sequence ground truth.
 */
export const MATHS_SECONDARY: SequenceGroundTruth = {
  subject: 'maths',
  phase: 'secondary',
  query: 'secondary mathematics curriculum programme',
  expectedRelevance: {
    'maths-secondary': 3,
  },
  description: 'The complete secondary mathematics programme covering KS3 and KS4 (Years 7-11).',
} as const;
