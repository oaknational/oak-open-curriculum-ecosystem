/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // Query: "relegion stories primary" - tests typo recovery for story content
  'shared-stories': 3, // MY #2, Original expected - about shared religious stories
  'how-christians-use-art-to-tell-stories': 3, // Search #1 - story-focused
  'the-story-of-holi': 2, // Search #2 - specific religious story
  'the-story-of-the-blind-men-and-the-elephant': 2, // Search #9 - religious story
  'noah-and-the-rainbow': 2, // Original expected - religious story
} as const;
