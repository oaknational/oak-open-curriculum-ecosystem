/**
 * Query definition for KS4 Chemistry content relevance.
 *
 * Tests search quality for KS4 Chemistry content.
 */

import type { GroundTruthQueryDefinition } from '../../../types';

/**
 * KS4 Chemistry: Ionic bonding and electron transfer.
 *
 * Ionic bonding is a core KS4 Chemistry topic. Tests whether search correctly
 * prioritises lessons that explain the mechanism (electron transfer, ion formation)
 * vs. lessons that merely mention ionic compounds.
 */
export const SCIENCE_KS4_CHEMISTRY_FILTER_QUERY: GroundTruthQueryDefinition = {
  query: 'ionic bonding electron transfer',
  category: 'precise-topic',
  description: 'Tests search relevance for KS4 Chemistry ionic bonding content',
  expectedFile: './chemistry-filter.expected.ts',
  keyStage: 'ks4',
} as const;
