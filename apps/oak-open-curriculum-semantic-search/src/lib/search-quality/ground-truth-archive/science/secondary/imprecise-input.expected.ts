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

export const SCIENCE_SECONDARY_IMPRECISE_INPUT_EXPECTED: ExpectedRelevance = {
  // Foundational explanation of respiration
  'cellular-respiration': 3,
  // Core aerobic respiration content
  'aerobic-cellular-respiration': 3,
  // Human-specific respiration content
  'anaerobic-cellular-respiration-in-humans': 3,
  // Distinguishes breathing vs respiration in humans
  'breathing-respiration-and-gas-exchange': 2,
  // KS4 detailed human respiration
  'aerobic-cellular-respiration-in-humans-and-other-organisms': 2,
} as const;
