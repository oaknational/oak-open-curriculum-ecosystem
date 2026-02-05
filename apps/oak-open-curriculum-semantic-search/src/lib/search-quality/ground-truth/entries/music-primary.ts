/**
 * Music Primary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Music Primary ground truth: Rounds as a singing structure.
 */
export const MUSIC_PRIMARY: MinimalGroundTruth = {
  subject: 'music',
  phase: 'primary',
  keyStage: 'ks2',
  query: 'round song structure same melody groups',
  expectedRelevance: {
    'rounds-as-a-singing-structure': 3,
    'singing-together-bonds-us-together': 2,
    'rhythmic-ostinato-and-practising-rounds': 2,
  },
  description:
    'Lesson teaches that a round is a song structure where the same melody is sung in groups at different times.',
} as const;
