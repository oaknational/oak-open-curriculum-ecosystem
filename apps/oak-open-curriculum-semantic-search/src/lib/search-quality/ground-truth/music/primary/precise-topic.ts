/**
 * Precise-topic ground truth query for Primary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const MUSIC_PRIMARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'syncopation rhythm music ks2',
    expectedRelevance: {
      'syncopation-in-songs': 3,
      'syncopated-rhythms': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests rhythm concept vocabulary with key stage',
  },
] as const;
