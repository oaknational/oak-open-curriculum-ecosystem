/**
 * Thread ground truth: Science — BQ11 Physics: Forces
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Targets the "BQ11 Physics: How do forces make things happen?" Big Question thread.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `bq11-physics-how-do-forces-make-things-happen` (Science)
 *
 * ## Thread Content
 *
 * This Big Question thread covers forces and motion from primary (pushes, pulls,
 * gravity) through secondary (Newton's laws, momentum, pressure). It shows how
 * the concept of forces develops across the entire science curriculum.
 *
 * ## Query Design
 *
 * A science teacher looking for the forces progression strand would search
 * for "forces motion physics progression" to find how force concepts build.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Science thread ground truth: Forces and motion progression.
 */
export const SCIENCE_FORCES: ThreadGroundTruth = {
  subject: 'science',
  query: 'forces and motion physics progression',
  expectedRelevance: {
    'bq11-physics-how-do-forces-make-things-happen': 3,
  },
  description:
    'Big Question thread covering forces from primary pushes/pulls through secondary Newton laws and momentum.',
} as const;
