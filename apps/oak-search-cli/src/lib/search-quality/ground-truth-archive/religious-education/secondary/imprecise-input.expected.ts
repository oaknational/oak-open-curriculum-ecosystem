/**
 * Expected relevance for imprecise-input ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 */

import type { ExpectedRelevance } from '../../types';

export const RELIGIOUS_EDUCATION_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // CORRECTED: Query is "meditaton and prayer practices" (typo test)
  // Previous expected (dhamma = ethics) was misaligned - dhamma is about morality, not meditation
  // NOTE: Search returned Buddhist meditation slugs not in RE-secondary bulk data
  // Using valid RE-secondary slugs for prayer/worship practices
  'forms-of-worship': 3, // MY #1 - worship practices
  'salah-as-one-of-the-five-pillars': 3, // MY #2 - Islamic prayer
  'how-and-why-muslims-perform-salah': 3, // MY #3 - Islamic prayer practices
  'different-forms-of-worship': 2, // Christian worship forms
  'contrasting-worship-in-islam-and-christianity': 2, // Cross-faith worship/prayer
} as const;
