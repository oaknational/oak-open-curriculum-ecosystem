/**
 * Expected relevance for cross-topic ground truth.
 * Query: "area and perimeter problems together"
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * Phase 1C Review (2026-01-20):
 * Changed from "fractions word problems money" to "area and perimeter problems together".
 * All 4 expected slugs have MCP-verified key learning combining BOTH area AND perimeter.
 * Keywords for all include Area and Perimeter explicitly.
 */

import type { ExpectedRelevance } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  'solve-problems-involving-area-and-perimeter': 3,
  'reason-about-shapes-using-the-relationship-between-side-lengths-and-area-and-perimeter': 3,
  'shapes-with-the-same-areas-can-have-different-perimeters-and-vice-versa': 3,
  'reason-about-compound-shapes-using-the-relationship-between-side-lengths-and-area-and-perimeter': 2,
} as const;
