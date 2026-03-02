/**
 * Thread ground truth: Science — BQ08 Chemistry: Chemical Reactions
 *
 * Ground truth for testing thread search quality using Known-Answer-First methodology.
 * Targets the "BQ08 Chemistry: How can substances be made and changed?" Big Question thread.
 *
 * ## Source Data
 *
 * Explored: thread-progression-data.ts (164 threads, 16 subjects)
 * Target thread: `bq08-chemistry-how-can-substances-be-made-and-changed` (Science)
 *
 * ## Thread Content
 *
 * This Big Question thread covers chemical reactions from primary (materials changing)
 * through secondary (chemical equations, rates of reaction, organic chemistry). It
 * shows the progression of understanding how substances interact and transform.
 *
 * ## Query Design
 *
 * A chemistry teacher wanting to see how reaction concepts develop across years
 * would search for "chemical reactions substances changing" to find this thread.
 */

import type { ThreadGroundTruth } from '../types';

/**
 * Science thread ground truth: Chemical reactions and changes progression.
 */
export const SCIENCE_CHEMICAL_REACTIONS: ThreadGroundTruth = {
  subject: 'science',
  query: 'chemical reactions substances changing',
  expectedRelevance: {
    'bq08-chemistry-how-can-substances-be-made-and-changed': 3,
    'bq07-chemistry-what-are-things-made-of': 1,
  },
  description:
    'Big Question thread covering chemical changes from primary materials through secondary reactions, equations, and organic chemistry.',
} as const;
