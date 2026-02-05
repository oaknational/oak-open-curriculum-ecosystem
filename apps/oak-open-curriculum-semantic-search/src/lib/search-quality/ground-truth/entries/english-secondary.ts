/**
 * English Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { MinimalGroundTruth } from '../types';

/**
 * English Secondary ground truth: Analysing atmosphere in detective fiction.
 */
export const ENGLISH_SECONDARY: MinimalGroundTruth = {
  subject: 'english',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'analysing atmosphere in detective fiction',
  expectedRelevance: {
    'analysing-atmosphere-and-character': 3,
    'thornfield-hall-atmosphere-in-jane-eyre': 2,
    'reading-the-speckled-band': 3,
  },
  description:
    'Lesson teaches how Conan Doyle creates atmosphere in "The Speckled Band" through juxtaposition of settings.',
} as const;
