/**
 * Cross-subject ground truth: "mountain" unfiltered search.
 *
 * Captures a case where searching for "mountain" without subject filter
 * returns 8,277 results with geography mountain lessons competing against
 * English "story mountain" lessons (a narrative planning technique).
 *
 * Known-answer-first discovery: lessons identified independently from
 * bulk curriculum data before examining search results.
 *
 * Key finding: "mountain" is 8 characters so fuzziness is not the
 * primary issue — the volume problem is driven by "story mountain"
 * appearing in many English lesson transcripts.
 *
 * @see search-results-quality.md for root cause analysis
 */

import type { CrossSubjectLessonGroundTruth } from '../types';

/**
 * Cross-subject ground truth for unfiltered "mountain" lesson search.
 *
 * Expected relevant lessons are from geography, covering mountain
 * formation, features, and global mountains. The query deliberately
 * has no subject filter to test whether genuinely mountain-related
 * lessons rank above English "story mountain" lessons.
 */
export const MOUNTAIN_LESSONS: CrossSubjectLessonGroundTruth = {
  query: 'mountain',
  expectedRelevance: {
    'the-formation-of-mountains': 3,
    'mountains-and-their-features': 3,
    'mountains-and-landmarks-of-the-world': 2,
  },
  description:
    'Unfiltered "mountain" search should surface geography lessons about actual mountains (formation, features, world landmarks), not English "story mountain" narrative technique lessons.',
} as const;
