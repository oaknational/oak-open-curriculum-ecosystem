/**
 * Cross-topic ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: score=3 combines all concepts; score=2 covers portraits+expression (power), weaker on colour */
export const ART_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'portraits and colour expression',
    category: 'cross-topic',
    priority: 'medium',
    description:
      'Tests intersection of portraits with colour/expression. Score=3 slug explicitly addresses paint+colour+emotion in portraits.',
    expectedRelevance: {
      'exploring-portraits-through-paint': 3,
      'exploring-power-in-the-portrait': 2,
    },
  },
] as const;
