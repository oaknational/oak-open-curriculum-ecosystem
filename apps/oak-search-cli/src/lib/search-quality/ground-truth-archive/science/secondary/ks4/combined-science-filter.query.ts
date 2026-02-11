/**
 * Query definition for KS4 Combined Science content relevance.
 *
 * Tests search quality for KS4 Combined Science content.
 */

import type { GroundTruthQueryDefinition } from '../../../types';

/**
 * KS4 Combined Science: Energy transfers and efficiency.
 *
 * Energy transfers is a cross-cutting KS4 Combined Science topic that appears
 * across physics contexts (thermal, electrical, mechanical) and biology
 * (respiration, food chains). Tests whether search correctly prioritises
 * lessons that explain energy transfer principles and efficiency calculations.
 */
export const SCIENCE_KS4_COMBINED_SCIENCE_FILTER_QUERY: GroundTruthQueryDefinition = {
  query: 'energy transfers and efficiency',
  category: 'precise-topic',
  description: 'Tests search relevance for KS4 Combined Science energy transfer content',
  expectedFile: './combined-science-filter.expected.ts',
  keyStage: 'ks4',
} as const;
