/**
 * Cross-topic ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const DT_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'structures and materials testing',
    expectedRelevance: {
      'testing-bridge-structures': 3,
      'feedback-and-evaluation-about-materials-and-systems': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of structures with materials evaluation',
  },
] as const;
