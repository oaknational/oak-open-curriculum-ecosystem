/**
 * Cross-topic ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests sketching + materials intersection */
export const DT_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'sketching and materials properties',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of design sketching with materials science',
    expectedRelevance: {
      'advanced-3d-sketching': 3,
      'polymer-properties-and-processes': 2,
    },
  },
] as const;
