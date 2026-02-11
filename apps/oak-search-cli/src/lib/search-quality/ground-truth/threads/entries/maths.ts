/**
 * Thread ground truth: Maths
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 *
 * ## Source Data
 *
 * Explored: `bulk-downloads/maths-primary.json` and `bulk-downloads/maths-secondary.json`
 * Extracted threads: algebra, geometry-and-measure, number, number-addition-and-subtraction,
 *   number-fractions, number-multiplication-and-division, number-place-value, probability,
 *   ratio-and-proportion, statistics
 * Target thread: `algebra` (25 units spanning Year 6 to Year 11)
 *
 * ## Thread Content (from bulk data)
 *
 * Units in algebra thread include:
 * - expressions-and-equations (Year 7)
 * - solving-linear-equations (Year 8)
 * - expressions-and-formulae (Year 9)
 * - algebraic-manipulation (Year 10)
 * - algebraic-fractions (Year 11)
 *
 * ## Query Design
 *
 * A teacher looking for the algebra curriculum progression would search for
 * equations and progression. Query tested via test-query-threads.ts.
 *
 * ## Test Results
 *
 * Position 1: algebra - TARGET
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Maths thread ground truth: Algebra curriculum progression.
 */
export const MATHS: ThreadGroundTruth = {
  subject: 'maths',
  query: 'algebra equations progression',
  expectedRelevance: {
    algebra: 3,
  },
  description:
    'Thread covering algebraic progression from Year 6 order of operations through Year 11 algebraic fractions.',
} as const;
