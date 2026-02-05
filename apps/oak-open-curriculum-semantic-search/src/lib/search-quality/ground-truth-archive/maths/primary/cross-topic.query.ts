/**
 * Query definition for cross-topic ground truth.
 *
 * This file contains ONLY the query metadata, NOT the expected results.
 * Expected results are in ./cross-topic.expected.ts
 *
 * Phase 1C Review (2026-01-20):
 * Changed from "fractions word problems money" to "area and perimeter problems together".
 * The original query's cross-topic intersection (fractions + money) does not exist
 * strongly in curriculum. The new query has 4 verified lessons explicitly combining
 * area AND perimeter concepts.
 *
 * @packageDocumentation
 */

import type { GroundTruthQueryDefinition } from '../../types';

export const MATHS_PRIMARY_CROSS_TOPIC_QUERY: GroundTruthQueryDefinition = {
  query: 'area and perimeter problems together',
  category: 'cross-topic',
  description:
    'Tests cross-topic capability: combines area (2D space measurement) with perimeter (distance around shape). Verified: 4 lessons explicitly address both concepts.',
  expectedFile: './cross-topic.expected.ts',
} as const;
