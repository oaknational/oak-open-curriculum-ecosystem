/**
 * English Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 */

import type { LessonGroundTruth } from '../types';

/**
 * English Secondary ground truth: Analysing atmosphere in detective fiction.
 */
export const ENGLISH_SECONDARY: LessonGroundTruth = {
  subject: 'english',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'analysing atmosphere detective fiction',
  expectedRelevance: {
    'analysing-atmosphere-and-character': 3,
    'thornfield-hall-atmosphere-in-jane-eyre': 2,
    'reading-the-speckled-band': 2,
  },
  description:
    'Lesson teaches how Conan Doyle creates atmosphere in "The Speckled Band" through juxtaposition of settings.',
} as const;
