/**
 * Cross-subject ground truth: "tree" unfiltered search.
 *
 * Captures a case where searching for "tree" without subject filter
 * returns 10,000 results mixing genuinely tree-related science and
 * geography lessons with maths probability "tree diagrams", English
 * novel lessons ('The Twisted Tree'), and "A Poison Tree" poetry.
 *
 * Known-answer-first discovery: lessons identified independently from
 * bulk curriculum data before examining search results.
 *
 * Key finding: "tree" is a 4-character word, so with AUTO fuzziness
 * it gets 1-edit tolerance — matching "three" as a fuzzy hit, which
 * inflates results from maths transcripts.
 *
 * @see search-results-quality.md for root cause analysis
 */

import type { CrossSubjectLessonGroundTruth } from '../types';

/**
 * Cross-subject ground truth for unfiltered "tree" lesson search.
 *
 * Expected relevant lessons span science (plant biology) and geography
 * (forests, environment) — the query deliberately has no subject filter
 * to test cross-subject quality.
 */
export const TREE_LESSONS: CrossSubjectLessonGroundTruth = {
  query: 'tree',
  expectedRelevance: {
    'structure-of-a-tree': 3,
    'the-benefits-of-trees': 3,
    'deciduous-and-evergreen-trees': 2,
  },
  description:
    'Unfiltered "tree" search should surface lessons directly about trees (science plant biology, geography forests/environment), not maths probability tree diagrams, English novel chapters, or lessons containing "three" via fuzzy matching.',
} as const;
