/**
 * Cross-subject ground truth: "apple" unfiltered search.
 *
 * Captures the diagnostic case where searching for "apple" without any
 * subject filter returns 8,329 results dominated by PE and English
 * lessons containing "apply" (1-edit fuzzy match), while genuinely
 * apple-related lessons are buried.
 *
 * Known-answer-first discovery: lessons identified independently from
 * curriculum data before examining search results.
 *
 * @see search-results-quality.md for root cause analysis
 */

import type { CrossSubjectLessonGroundTruth } from '../types';

/**
 * Cross-subject ground truth for unfiltered "apple" lesson search.
 *
 * Expected relevant lessons span cooking-nutrition and science — the
 * query deliberately has no subject filter to test cross-subject quality.
 */
export const APPLE_LESSONS: CrossSubjectLessonGroundTruth = {
  query: 'apple',
  expectedRelevance: {
    'making-apple-flapjack-bites': 3,
    'producing-our-food': 2,
    'selective-breeding-of-plants-non-statutory': 2,
  },
  description:
    'Unfiltered "apple" search should surface lessons directly about apples (cooking, food production, plant breeding), not lessons containing "apply" via fuzzy matching.',
} as const;
