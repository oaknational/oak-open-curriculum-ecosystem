/**
 * Query definition for KS4 Biology content relevance.
 *
 * Tests search quality for KS4 Biology content.
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../../types';

/**
 * KS4 Biology: Carbon cycle in ecosystems.
 *
 * The carbon cycle is a core KS4 Biology topic that connects photosynthesis,
 * respiration, decomposition, and combustion. Tests whether search correctly
 * prioritises lessons that explain the cycle as a whole vs. individual processes.
 */
export const SCIENCE_KS4_BIOLOGY_FILTER_QUERY: GroundTruthQueryDefinition = {
  query: 'carbon cycle in ecosystems',
  category: 'precise-topic',
  description: 'Tests search relevance for KS4 Biology carbon cycle content',
  expectedFile: './biology-filter.expected.ts',
  keyStage: 'ks4',
} as const;
