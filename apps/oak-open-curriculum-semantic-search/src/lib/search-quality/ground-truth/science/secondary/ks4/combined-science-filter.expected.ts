/**
 * Expected relevance for KS4 Combined Science: energy transfers and efficiency.
 *
 * Updated 2026-01-23: GT corrected — search was returning BETTER results than expected.
 * Original GT had work/power/kinetic-energy lessons; query asks for "efficiency".
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../../types';

export const SCIENCE_KS4_COMBINED_SCIENCE_FILTER_EXPECTED: ExpectedRelevance = {
  // Lessons directly about efficiency (query: "energy transfers and efficiency")
  'efficiency-in-terms-of-useful-output-energy-transfer': 3,
  'calculating-efficiency-in-terms-of-useful-output-energy-transfer': 3,
  'calculating-efficiency-in-terms-of-energy-and-power': 3,
  'efficiency-in-terms-of-energy-and-power': 3,
  'efficiency-in-terms-of-useful-energy-transferred': 2,
} as const;
