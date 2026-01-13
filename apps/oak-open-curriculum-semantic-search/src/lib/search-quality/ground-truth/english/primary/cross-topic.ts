/**
 * Cross-topic ground truth query for Primary English.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Primary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000). Query combines writing skills AND
 * grammar concepts (tenses). Tests ability to find content at
 * intersection of these two English curriculum areas.
 */
export const ENGLISH_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'writing and grammar tenses together',
    expectedRelevance: {
      'writing-sentences-in-the-simple-present-past-and-future-tense': 3,
      'writing-sentences-in-the-progressive-present-past-and-future-tense': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of writing skills with grammar concepts',
  },
] as const;
