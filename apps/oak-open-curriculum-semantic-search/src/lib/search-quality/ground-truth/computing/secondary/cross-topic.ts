/**
 * Cross-topic ground truth query for Secondary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-14 - Replaced math-operations slug with iterating slug (query asks for loops, not math) */
export const COMPUTING_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'programming with data structures loops',
    category: 'cross-topic',
    priority: 'medium',
    description:
      'Tests intersection of programming + data structures + loops - both expected slugs explicitly cover iteration through data structures',
    expectedRelevance: {
      'using-for-loops-to-iterate-data-structures': 3,
      'iterating-through-data-structures': 2,
    },
  },
] as const;
