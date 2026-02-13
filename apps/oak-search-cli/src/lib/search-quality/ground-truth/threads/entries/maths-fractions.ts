/**
 * Thread ground truth: Maths — Number: Fractions
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Threads are conceptual progression strands — this GT targets the "Number: Fractions"
 * strand, which shows how fraction concepts build from early primary through secondary.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `number-fractions` (Maths)
 *
 * ## Thread Content
 *
 * The Number: Fractions thread covers fraction concepts from early primary
 * (halves and quarters) through secondary (algebraic fractions, recurring decimals).
 * Related threads: `number` (broader), `ratio-and-proportion` (connected concept).
 *
 * ## Query Design
 *
 * A primary teacher planning fraction teaching across year groups would search
 * for "fractions progression" to find the conceptual strand showing how fraction
 * understanding builds over time.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Maths thread ground truth: Number Fractions progression.
 */
export const MATHS_FRACTIONS: ThreadGroundTruth = {
  subject: 'maths',
  query: 'fractions progression primary maths',
  expectedRelevance: {
    'number-fractions': 3,
    number: 2,
    'ratio-and-proportion': 1,
  },
  description:
    'Thread covering fraction concepts from early primary halves and quarters through secondary algebraic fractions.',
} as const;
