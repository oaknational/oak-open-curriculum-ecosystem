/**
 * Imprecise-input ground truth query for Secondary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.333, tests "rythm" misspelling */
export const MUSIC_SECONDARY_IMPRECISE_INPUT: readonly GroundTruthQuery[] = [
  {
    query: 'rythm patterns drums',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common misspelling of "rhythm" - tests fuzzy recovery',
    expectedRelevance: {
      'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
      'creating-variation-to-a-fundamental-drum-groove': 2,
    },
  },
] as const;
