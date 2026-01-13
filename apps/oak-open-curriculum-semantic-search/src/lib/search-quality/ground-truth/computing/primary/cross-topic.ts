/**
 * Cross-topic ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests programming + sequences intersection */
export const COMPUTING_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'programming and code sequences',
    expectedRelevance: {
      'combining-code-blocks-in-a-sequence': 3,
      'programming-sprites': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of programming concepts with sequence logic',
  },
] as const;
