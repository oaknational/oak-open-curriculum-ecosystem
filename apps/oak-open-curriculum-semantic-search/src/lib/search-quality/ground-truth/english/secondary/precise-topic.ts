/**
 * Precise-topic ground truth query for Secondary English.
 *
 * Tests basic retrieval using curriculum-aligned terminology.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Precise-topic query for Secondary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: Perfect MRR (1.000), core GCSE text (Lord of the Flies),
 * symbolism is a key literary analysis concept. Expected slugs match.
 */
export const ENGLISH_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'Lord of the Flies symbolism',
    expectedRelevance: {
      'goldings-use-of-symbolism-in-lord-of-the-flies': 3,
      'allusions-in-lord-of-the-flies': 3,
      'goldings-message-about-human-behaviour': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Lord of the Flies symbolism content',
  },
] as const;
