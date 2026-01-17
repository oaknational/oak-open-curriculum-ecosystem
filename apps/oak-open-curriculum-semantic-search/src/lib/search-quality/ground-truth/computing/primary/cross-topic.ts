/**
 * Cross-topic ground truth query for Primary Computing.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: systematically compared all 12 sequence-related lessons */
export const COMPUTING_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'programming and code sequences',
    expectedRelevance: {
      'programming-sequences': 3,
      sequences: 2,
      'combining-code-blocks-in-a-sequence': 2,
      'building-blocks-to-create-a-sequence': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description:
      'Tests programming + sequences intersection. Score=3 is the foundational lesson ("programs run in a sequence"); score=2 are related sequence lessons from KS1 and KS2 units.',
  },
] as const;
