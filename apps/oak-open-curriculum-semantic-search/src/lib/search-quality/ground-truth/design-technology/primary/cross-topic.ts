/**
 * Cross-topic ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Replaced general evaluation lesson with materials+structures intersection */
export const DT_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'structures and materials testing',
    expectedRelevance: {
      'testing-bridge-structures': 3,
      'shapes-and-materials-used-in-playground-structures': 3,
      'test-and-talk-about-the-final-playground-structure': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description:
      'Tests intersection of structures with materials - both bridge testing and playground materials',
  },
] as const;
