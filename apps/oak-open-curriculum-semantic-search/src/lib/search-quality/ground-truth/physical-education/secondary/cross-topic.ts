/**
 * Cross-topic ground truth query for Secondary Physical Education.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests fitness + athletics intersection */
export const PE_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'fitness and athletics together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of fitness training with athletics events',
    expectedRelevance: {
      'design-your-programme': 3,
      'running-for-speed-and-the-relationship-between-distance-and-time': 2,
    },
  },
] as const;
