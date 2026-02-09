/**
 * Citizenship Secondary ground truth entry.
 *
 * @see ground-truth-protocol.md for the process
 * @packageDocumentation
 */

import type { LessonGroundTruth } from '../types';

/**
 * Citizenship Secondary ground truth: Government vs Parliament.
 */
export const CITIZENSHIP_SECONDARY: LessonGroundTruth = {
  subject: 'citizenship',
  phase: 'secondary',
  keyStage: 'ks3',
  query: 'government and parliament',
  expectedRelevance: {
    'what-is-the-difference-between-the-government-and-parliament': 3,
    'how-is-local-government-different-to-central-government': 2,
    'what-are-the-differences-between-the-uk-and-us-political-systems': 2,
  },
  description: 'Lesson teaches the key differences between parliament and government in the UK.',
} as const;
