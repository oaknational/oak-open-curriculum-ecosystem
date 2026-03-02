/**
 * Expected relevance for cross-topic-2 ground truth.
 *
 * Control comparison for imprecise-input "vikins and anglo saxons" (typos).
 * Uses SAME expected slugs to enable direct metric comparison:
 * - If imprecise-input scores low but cross-topic-2 scores high → fuzzy matching issue
 * - If both score low → expected slugs need review or semantic matching issue
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const HISTORY_PRIMARY_CROSS_TOPIC_2_EXPECTED: ExpectedRelevance = {
  'how-the-vikings-changed-britain': 3,
  'the-anglo-saxon-fightback': 3,
  'why-the-vikings-came-to-britain': 3,
  'anglo-saxon-kingdoms': 2,
} as const;
