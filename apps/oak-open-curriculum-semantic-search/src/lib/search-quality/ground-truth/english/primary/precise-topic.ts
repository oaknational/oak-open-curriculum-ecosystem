/**
 * Precise-topic ground truth query for Primary English.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Primary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), popular text (The BFG by Roald Dahl),
 * expected slugs directly match lesson titles. Core reading comprehension topic.
 */
export const ENGLISH_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'The BFG reading comprehension Roald Dahl Year 3',
    expectedRelevance: {
      'engaging-with-the-bfg': 3,
      'engaging-with-the-opening-chapter-of-the-bfg': 3,
      'writing-the-opening-of-the-bfg-part-one': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of The BFG reading content using curriculum terminology',
  },
] as const;
