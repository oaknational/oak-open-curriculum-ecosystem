/**
 * Cross-topic ground truth query for Secondary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const MUSIC_SECONDARY_CROSS_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'film music and composition together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of film music with composition skills',
    expectedRelevance: {
      'creating-scary-music': 3,
      'tension-in-early-movies': 2,
    },
  },
] as const;
