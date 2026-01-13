/**
 * Cross-topic ground truth query for Primary Maths.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Primary Maths.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000). Query combines two distinct geometry
 * manipulatives (pattern blocks AND tangrams). Search correctly finds
 * lessons covering both resources.
 */
export const MATHS_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'pattern blocks tangrams',
    expectedRelevance: {
      'compose-tangram-images': 3,
      'composing-pattern-block-images': 3,
      'tetrominoes-and-pentominoes': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Combines two manipulative resources - tests multi-concept handling',
  },
] as const;
