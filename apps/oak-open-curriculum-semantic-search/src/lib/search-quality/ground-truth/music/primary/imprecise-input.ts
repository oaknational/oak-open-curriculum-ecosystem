/**
 * Imprecise-input ground truth query for Primary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "rythm" misspelling */
export const MUSIC_PRIMARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'rythm beat ks1',
    expectedRelevance: {
      'learning-about-beat': 3,
      'syncopated-rhythms': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of rhythm - tests fuzzy recovery',
  },
] as const;
