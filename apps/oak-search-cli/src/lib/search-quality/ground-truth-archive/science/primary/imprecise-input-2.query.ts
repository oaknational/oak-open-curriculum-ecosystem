/**
 * Query definition for imprecise-input-2 ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./imprecise-input-2.expected.ts
 *
 * @remarks
 * Tests cross-topic search for two distinct KS1 concepts (plants AND animals)
 * that are commonly taught together in habitats and food chains units.
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const SCIENCE_PRIMARY_IMPRECISE_INPUT_2_QUERY: GroundTruthQueryDefinition = {
  query: 'plints and enimals',
  category: 'imprecise-input',
  description:
    'Tests typo recovery for cross-topic KS1 content (plants + animals) - phonetic NZ spelling',
  expectedFile: './imprecise-input-2.expected.ts',
} as const;
