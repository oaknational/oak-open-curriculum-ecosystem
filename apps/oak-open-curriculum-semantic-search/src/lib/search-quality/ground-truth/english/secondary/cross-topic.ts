/**
 * Cross-topic ground truth query for Secondary English.
 *
 * Tests multi-concept handling when queries span multiple topics.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Cross-topic query for Secondary English.
 *
 * AI Curation: 2026-01-11
 * Decision: KEEP
 * Rationale: MRR 0.100 reflects challenge of cross-topic intersection.
 * Query combines grammar/punctuation AND essay writing - tests ability
 * to find content at intersection of technical skills and composition.
 */
export const ENGLISH_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'grammar and punctuation in essay writing',
    expectedRelevance: {
      'persuasive-opinion-pieces': 3,
      'annotating-essay-questions-and-writing-thesis-statements': 2,
      'developing-comparative-essay-writing-skills': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Cross-topic intersection - tests grammar + essay writing overlap',
  },
] as const;
