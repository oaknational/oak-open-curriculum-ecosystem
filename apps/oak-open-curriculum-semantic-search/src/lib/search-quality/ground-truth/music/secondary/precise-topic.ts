/**
 * Precise-topic ground truth query for Secondary Music.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const MUSIC_SECONDARY_PRECISE_TOPIC: readonly GroundTruthQuery[] = [
  {
    query: 'drum grooves rhythm',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for drum grooves units',
    expectedRelevance: {
      'the-role-of-the-kick-and-snare-in-drum-grooves': 3,
      'creating-variation-to-a-fundamental-drum-groove': 3,
      'the-role-of-the-hi-hat-in-a-drum-groove': 2,
    },
  },
] as const;
