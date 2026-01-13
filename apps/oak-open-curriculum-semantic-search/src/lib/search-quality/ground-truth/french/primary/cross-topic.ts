/**
 * Cross-topic ground truth query for Primary French.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests verbs + vocabulary intersection */
export const FRENCH_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'French verbs and vocabulary together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of grammar with vocabulary topics',
    expectedRelevance: {
      'age-avoir-meaning-be': 3,
      'my-monster-il-y-a-and-il-a': 2,
    },
  },
] as const;
