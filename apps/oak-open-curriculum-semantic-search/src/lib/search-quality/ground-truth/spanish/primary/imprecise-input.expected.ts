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

export const SPANISH_PRIMARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  'greetings-the-verb-estar': 3,
  'today-vs-in-general-somos-and-estamos': 2,
} as const;
