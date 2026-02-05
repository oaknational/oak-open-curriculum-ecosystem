/**
 * Expected relevance for precise-topic-4 ground truth.
 *
 * Control comparison for imprecise-input-2 "multiplikation timetables year 3" (typos).
 * Uses SAME expected slugs to enable direct metric comparison:
 * - If imprecise-input-2 scores low but precise-topic-4 scores high → fuzzy/tokenization issue
 * - If both score low → expected slugs need review or semantic matching issue
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_PRECISE_TOPIC_4_EXPECTED: ExpectedRelevance = {
  'represent-the-2-times-table-in-different-ways': 3,
  'represent-the-5-times-table-in-different-ways': 3,
  'represent-the-10-times-table-in-different-ways': 3,
  'use-knowledge-of-the-2-times-table-to-solve-problems': 2,
  'use-knowledge-of-the-3-and-6-times-tables-to-solve-problems': 2,
} as const;
