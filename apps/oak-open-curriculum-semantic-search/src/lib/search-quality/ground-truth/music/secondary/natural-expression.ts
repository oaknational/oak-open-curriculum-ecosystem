/**
 * Natural-expression ground truth query for Secondary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const MUSIC_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'teach folk songs sea shanty',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent + specific genre (sea shanties)',
    expectedRelevance: {
      'singing-sea-shanties': 3,
      'modes-and-sea-shanties': 3,
      'characteristics-of-folk-songs': 2,
    },
  },
] as const;
