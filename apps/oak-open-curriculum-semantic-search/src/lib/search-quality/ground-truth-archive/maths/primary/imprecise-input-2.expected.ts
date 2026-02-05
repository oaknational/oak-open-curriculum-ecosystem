/**
 * Expected relevance for imprecise-input-2 ground truth.
 * Query: "multiplikation timetables" (misspellings)
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_IMPRECISE_INPUT_2_EXPECTED: ExpectedRelevance = {
  'represent-the-2-times-table-in-different-ways': 3,
  'represent-the-5-times-table-in-different-ways': 3,
  'represent-the-10-times-table-in-different-ways': 3,
  'use-knowledge-of-the-2-times-table-to-solve-problems': 2,
  'use-knowledge-of-the-3-and-6-times-tables-to-solve-problems': 2,
} as const;
