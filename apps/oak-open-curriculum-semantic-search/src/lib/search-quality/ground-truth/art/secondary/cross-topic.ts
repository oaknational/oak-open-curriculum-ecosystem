/**
 * Cross-topic ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests portrait + colour intersection */
export const ART_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'portraits and colour expression',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of portrait techniques with colour/expression concepts',
    expectedRelevance: {
      'exploring-power-in-the-portrait': 3,
      'tone-hue-and-colour': 2,
    },
  },
] as const;
