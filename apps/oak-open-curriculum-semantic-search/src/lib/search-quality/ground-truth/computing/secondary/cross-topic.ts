/**
 * Cross-topic ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const COMPUTING_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'programming with data structures loops',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of programming and data structures concepts',
    expectedRelevance: {
      'using-for-loops-to-iterate-data-structures': 3,
      'mathematical-operations-in-data-structures': 2,
    },
  },
] as const;
