/**
 * Cross-topic ground truth query for Secondary Citizenship.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests democracy + laws intersection */
export const CITIZENSHIP_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'democracy and laws together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of democratic systems with legal frameworks',
    expectedRelevance: {
      'why-does-society-need-rules-and-laws': 3,
      'why-is-media-freedom-necessary-in-a-democracy': 2,
    },
  },
] as const;
