/**
 * Expected relevance for cross-topic ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const SPANISH_SECONDARY_CROSS_TOPIC_EXPECTED: ExpectedRelevance = {
  // Search found PERFECT matches - lessons explicitly about adjective + noun agreement (max 5)
  'places-in-the-spanish-speaking-world-plural-adjective-placement-and-agreement': 3, // Search #1 - explicit
  'people-singular-adjective-placement-and-agreement': 3, // Search #2 - explicit
  'day-of-the-teacher-plural-adjective-agreement': 3, // Search #3 - explicit
  'en-una-fiesta-de-cumpleanos-adjective-position-and-agreement': 2, // Search #4 - explicit
  'how-are-you-feeling-singular-gender-adjective-agreement': 2, // Phase 1B - gender adjective agreement
} as const;
