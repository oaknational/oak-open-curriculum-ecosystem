/**
 * Natural-expression ground truth query for Primary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests informal phrasing */
export const MUSIC_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'singing in tune for children',
    expectedRelevance: {
      'singing-and-moving-together': 3,
      'chanting-and-singing-in-time': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for singing lessons',
  },
] as const;
