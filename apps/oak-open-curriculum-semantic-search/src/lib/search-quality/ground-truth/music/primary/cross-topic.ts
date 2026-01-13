/**
 * Cross-topic ground truth query for Primary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const MUSIC_PRIMARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'singing and beat together',
    expectedRelevance: {
      'singing-and-moving-together': 3,
      'learning-about-beat': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of singing skills with rhythm concepts',
  },
] as const;
