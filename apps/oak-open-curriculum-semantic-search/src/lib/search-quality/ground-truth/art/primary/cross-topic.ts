/**
 * Cross-topic ground truth query for Primary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const ART_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'rainforest colour and texture painting',
    expectedRelevance: {
      'explore-the-shades-textures-and-colours-of-a-rainforest': 3,
      'paint-a-rainforest': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of colour theory and texture within themed art',
  },
] as const;
