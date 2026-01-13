/**
 * Precise-topic ground truth query for Secondary Science.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Secondary Science.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), core biology topic (cell structure),
 * foundational KS3 content. Expected slugs directly match lesson titles.
 */
export const SCIENCE_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'cell structure and function',
    expectedRelevance: {
      'animal-cell-structures-and-their-functions': 3,
      'plant-cell-structures-and-their-functions': 3,
      'specialised-cells-are-adapted-for-their-functions': 2,
      'multicellular-and-unicellular-organisms': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of cell structure content using curriculum terminology',
  },
] as const;
