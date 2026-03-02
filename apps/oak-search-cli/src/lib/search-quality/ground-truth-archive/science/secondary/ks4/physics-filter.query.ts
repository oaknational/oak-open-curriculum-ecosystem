/**
 * Query definition for KS4 Physics content relevance.
 *
 * Tests search quality for KS4 Physics content.
 */

import type { GroundTruthQueryDefinition } from '../../../types';

/**
 * KS4 Physics: Radioactive decay and half-life.
 *
 * Radioactive decay is a core KS4 Physics topic. Tests whether search correctly
 * prioritises lessons that explain the concept of half-life and decay curves
 * vs. lessons that cover nuclear physics more broadly.
 */
export const SCIENCE_KS4_PHYSICS_FILTER_QUERY: GroundTruthQueryDefinition = {
  query: 'radioactive decay half-life',
  category: 'precise-topic',
  description: 'Tests search relevance for KS4 Physics radioactive decay content',
  expectedFile: './physics-filter.expected.ts',
  keyStage: 'ks4',
} as const;
