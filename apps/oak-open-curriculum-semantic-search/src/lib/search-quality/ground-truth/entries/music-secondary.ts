/**
 * Music Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * Music Secondary ground truth: 12-bar blues chord sequence.
 */
export const MUSIC_SECONDARY: MinimalGroundTruth = {
  subject: 'music',
  phase: 'secondary',
  keyStage: 'ks3',
  query: '12-bar blues chord sequence',
  expectedRelevance: {
    'blues-music-and-the-12-bar-blues': 3,
    'building-an-improvisation': 2,
    'creating-an-idiomatic-blues-performance': 2,
  },
  description: 'Lesson teaches the 12-bar blues chord sequence using C, F and G chords.',
} as const;
