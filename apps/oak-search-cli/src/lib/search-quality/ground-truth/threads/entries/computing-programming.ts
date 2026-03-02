/**
 * Thread ground truth: Computing — Programming
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Targets the "Programming" thread in Computing.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `programming` (Computing)
 *
 * ## Thread Content
 *
 * The "Programming" thread covers coding progression from primary
 * (block-based programming, simple algorithms) through secondary
 * (text-based programming, data structures, software development).
 * Related threads: `algorithms-and-data-structures`, `design-and-development`.
 *
 * ## Query Design
 *
 * A computing teacher looking for the programming curriculum strand
 * would search for "programming coding progression" to find how
 * programming skills build across key stages.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Computing thread ground truth: Programming progression.
 */
export const COMPUTING_PROGRAMMING: ThreadGroundTruth = {
  subject: 'computing',
  query: 'programming coding skills progression',
  expectedRelevance: {
    programming: 3,
    'algorithms-and-data-structures': 1,
  },
  description:
    'Thread covering programming from primary block-based coding through secondary text-based programming and software development.',
} as const;
