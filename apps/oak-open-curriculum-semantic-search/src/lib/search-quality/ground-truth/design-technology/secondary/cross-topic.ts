/**
 * Cross-topic ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Deep review: realistic-rendering-techniques is BEST intersection (shows material texture) */
export const DT_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'sketching and materials properties',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of design sketching/rendering with materials representation',
    expectedRelevance: {
      'realistic-rendering-techniques': 3,
      'advanced-3d-sketching': 2,
      'materials-in-design': 2,
      'physical-and-working-properties-of-materials': 2,
    },
  },
] as const;
